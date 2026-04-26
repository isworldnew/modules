package ru.smirnov.accidentrecorder.file.implementation;

import lombok.extern.slf4j.Slf4j;
import org.bytedeco.javacv.*;
import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_core.Point;
import org.bytedeco.opencv.opencv_core.Scalar;
import org.springframework.stereotype.Component;
import ru.smirnov.accidentrecorder.entity.mongo.DetectedPerson;
import ru.smirnov.accidentrecorder.entity.mongo.Track;
import ru.smirnov.accidentrecorder.file.abstraction.RecordProcessor;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.List;

import static org.bytedeco.opencv.global.opencv_imgproc.rectangle;

@Slf4j
@Component
public class RecordProcessorImplementation implements RecordProcessor {

    private static final Scalar GREEN = new Scalar(0, 255, 0, 0);
    private static final int RECTANGLE_THICKNESS = 2;

    @Override
    public InputStream cropRecordWithBoundingBoxes(InputStream originalRecord, DetectedPerson detectedPerson) {
        if (originalRecord == null || detectedPerson == null) {
            log.error("Input stream or detected person is null");
            return null;
        }

        List<Track> tracks = detectedPerson.getTrack();
        if (tracks == null || tracks.isEmpty()) {
            log.warn("No tracks available for person: {}", detectedPerson.getId());
            return null;
        }

        double startTime = detectedPerson.getStartTime();
        double endTime = detectedPerson.getEndTime();

        log.info("Processing video segment: {}s - {}s, tracks count: {}", startTime, endTime, tracks.size());

        try (FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(originalRecord)) {
            grabber.start();

            double fps = grabber.getFrameRate();
            int width = grabber.getImageWidth();
            int height = grabber.getImageHeight();

            log.debug("Video info: fps={}, width={}, height={}", fps, width, height);

            // Устанавливаем позицию на начало нужного отрезка
            long startTimestamp = (long) (startTime * 1_000_000);
            grabber.setTimestamp(startTimestamp);

            // Подготавливаем выходной поток
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            FFmpegFrameRecorder recorder = new FFmpegFrameRecorder(outputStream, width, height);
            recorder.setVideoCodec(grabber.getVideoCodec());
            recorder.setFormat("mp4");
            recorder.setFrameRate(fps);
            recorder.start();

            Frame frame;
            long currentTimestampMicros;
            double currentTimeSec;
            int frameCount = 0;

            while ((frame = grabber.grabImage()) != null) {
                currentTimestampMicros = grabber.getTimestamp();
                currentTimeSec = currentTimestampMicros / 1_000_000.0;

                // Проверяем, не вышли ли за пределы нужного отрезка
                if (currentTimeSec > endTime) {
                    log.debug("Reached end time: {} > {}", currentTimeSec, endTime);
                    break;
                }

                // Находим или интерполируем трек для текущего времени
                Track currentTrack = getTrackForTime(tracks, currentTimeSec);
                if (currentTrack != null) {
                    // Рисуем bounding box на кадре
                    Mat mat = convertFrameToMat(frame);
                    if (mat != null) {
                        drawBoundingBox(mat, currentTrack, width, height);
                        // Конвертируем обработанный Mat обратно во Frame
                        frame = convertMatToFrame(mat);
                    }
                }

                // Записываем кадр (с bounding box или без)
                recorder.record(frame);
                frameCount++;
            }

            // Завершаем запись
            recorder.stop();
            grabber.stop();

            log.info("Processing completed. Processed {} frames, output size: {} bytes",
                    frameCount, outputStream.size());

            return new ByteArrayInputStream(outputStream.toByteArray());

        } catch (Exception e) {
            log.error("Failed to process video: {}", e.getMessage(), e);
            return null;
        }
    }

    private Track getTrackForTime(List<Track> tracks, double timeSec) {
        if (tracks.isEmpty()) {
            return null;
        }

        // Сначала ищем точное совпадение
        for (Track track : tracks) {
            if (Math.abs(track.getTime() - timeSec) < 0.01) {
                return track;
            }
        }

        // Ищем ближайшие треки до и после для интерполяции
        Track before = null;
        Track after = null;

        for (Track track : tracks) {
            if (track.getTime() <= timeSec) {
                if (before == null || track.getTime() > before.getTime()) {
                    before = track;
                }
            }
            if (track.getTime() >= timeSec) {
                if (after == null || track.getTime() < after.getTime()) {
                    after = track;
                }
            }
        }

        // Если есть оба трека - интерполируем
        if (before != null && after != null && before != after) {
            return interpolateTrack(before, after, timeSec);
        }

        // Если есть только один трек - используем его
        if (before != null) {
            return before;
        }

        return after;
    }

    private Track interpolateTrack(Track before, Track after, double timeSec) {
        double t1 = before.getTime();
        double t2 = after.getTime();
        double ratio = (timeSec - t1) / (t2 - t1);

        double cx = before.getCx() + (after.getCx() - before.getCx()) * ratio;
        double cy = before.getCy() + (after.getCy() - before.getCy()) * ratio;
        int w = (int) (before.getW() + (after.getW() - before.getW()) * ratio);
        int h = (int) (before.getH() + (after.getH() - before.getH()) * ratio);

        Track interpolated = new Track();
        interpolated.setTime(timeSec);
        interpolated.setCx(cx);
        interpolated.setCy(cy);
        interpolated.setW(w);
        interpolated.setH(h);

        log.trace("Interpolated track at time={}: cx={}, cy={}, w={}, h={}",
                timeSec, cx, cy, w, h);

        return interpolated;
    }

    private Mat convertFrameToMat(Frame frame) {
        if (frame == null || frame.image == null) {
            return null;
        }

        OpenCVFrameConverter.ToMat converter = new OpenCVFrameConverter.ToMat();
        return converter.convert(frame);
    }

    private Frame convertMatToFrame(Mat mat) {
        if (mat == null) {
            return null;
        }

        OpenCVFrameConverter.ToMat converter = new OpenCVFrameConverter.ToMat();
        return converter.convert(mat);
    }

    private void drawBoundingBox(Mat mat, Track track, int videoWidth, int videoHeight) {
        if (mat == null || track == null) {
            return;
        }

        double cx = track.getCx();
        double cy = track.getCy();
        int w = track.getW();
        int h = track.getH();

        int x1 = (int) Math.max(0, cx - w / 2.0);
        int y1 = (int) Math.max(0, cy - h / 2.0);
        int x2 = (int) Math.min(videoWidth, cx + w / 2.0);
        int y2 = (int) Math.min(videoHeight, cy + h / 2.0);

        rectangle(mat, new Point(x1, y1), new Point(x2, y2), GREEN, RECTANGLE_THICKNESS, 0, 0);

        log.trace("Drew bounding box: ({},{}) to ({},{})", x1, y1, x2, y2);
    }
}