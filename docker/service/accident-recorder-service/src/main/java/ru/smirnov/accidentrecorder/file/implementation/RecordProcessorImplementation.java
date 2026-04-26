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

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.bytedeco.ffmpeg.global.avcodec;

import static org.bytedeco.opencv.global.opencv_imgproc.rectangle;

@Slf4j
@Component
public class RecordProcessorImplementation implements RecordProcessor {

    private static final Scalar RED = new Scalar(0, 0, 255, 0);
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

        Path tempInputFile = null;
        Path tempOutputFile = null;

        try {
            // Создаем временные файлы вместо работы с потоками напрямую
            tempInputFile = Files.createTempFile("input_", ".mp4");
            tempOutputFile = Files.createTempFile("output_", ".mp4");

            // Копируем InputStream во временный файл
            try (FileOutputStream fos = new FileOutputStream(tempInputFile.toFile())) {
                originalRecord.transferTo(fos);
            }

            // Используем FFmpegFrameGrabber с файлом
            try (FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(tempInputFile.toFile())) {
                grabber.start();

                double fps = grabber.getFrameRate();
                int width = grabber.getImageWidth();
                int height = grabber.getImageHeight();

                log.debug("Video info: fps={}, width={}, height={}", fps, width, height);

                // Вычисляем кадры для startTime и endTime
                int startFrame = (int) Math.round(startTime * fps);
                int endFrame = (int) Math.round(endTime * fps);

                // Устанавливаем позицию на начало
                grabber.setVideoFrameNumber(startFrame);

                // Используем FFmpegFrameRecorder с файлом (не с потоком)
                try (FFmpegFrameRecorder recorder = new FFmpegFrameRecorder(tempOutputFile.toFile(), width, height)) {
                    recorder.setVideoCodec(avcodec.AV_CODEC_ID_H264);
                    recorder.setFormat("mp4");
                    recorder.setFrameRate(fps);
                    recorder.start();

                    Frame frame;
                    int frameCount = 0;
                    int currentFrame = startFrame;

                    while ((frame = grabber.grabImage()) != null && currentFrame <= endFrame) {
                        double currentTimeSec = currentFrame / fps;

                        // Находим или интерполируем трек для текущего времени
                        Track currentTrack = getTrackForTime(tracks, currentTimeSec);
                        if (currentTrack != null) {
                            Mat mat = convertFrameToMat(frame);
                            if (mat != null) {
                                drawBoundingBox(mat, currentTrack, width, height);
                                frame = convertMatToFrame(mat);
                            }
                        }

                        recorder.record(frame);
                        frameCount++;
                        currentFrame++;
                    }

                    recorder.stop();
                    grabber.stop();

                    log.info("Processing completed. Processed {} frames", frameCount);

                    // Читаем результат во временный файл
                    byte[] resultBytes = Files.readAllBytes(tempOutputFile);
                    return new ByteArrayInputStream(resultBytes);
                }
            }
        } catch (Exception e) {
            log.error("Failed to process video: {}", e.getMessage(), e);
            return null;
        } finally {
            // Очищаем временные файлы
            try {
                if (tempInputFile != null) Files.deleteIfExists(tempInputFile);
                if (tempOutputFile != null) Files.deleteIfExists(tempOutputFile);
            } catch (IOException e) {
                log.warn("Failed to delete temp files: {}", e.getMessage());
            }
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

        if (before != null && after != null && before != after) {
            return interpolateTrack(before, after, timeSec);
        }

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

        rectangle(mat, new Point(x1, y1), new Point(x2, y2), RED, RECTANGLE_THICKNESS, 0, 0);

        log.trace("Drew bounding box: ({},{}) to ({},{})", x1, y1, x2, y2);
    }
}