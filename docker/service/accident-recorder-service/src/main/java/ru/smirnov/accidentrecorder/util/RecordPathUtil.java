package ru.smirnov.accidentrecorder.util;

public class RecordPathUtil {

    /*
        area[зона_id]_camera[camera_id]_[timestamp_начала_записи].mp4

        area1_camera1_1777153814.mp4 [1777153814 = 26/04/2026 01:50:14]
    */

    private final static String AREA = "area";
    private final static String CAMERA = "camera";


    public static Long extractAreaId(String recordReference) {
        String areaDescriptor = recordReference.split("_")[0];
        return Long.valueOf(areaDescriptor.substring(AREA.length()));
    }

    public static Long extractCameraId(String recordReference) {
        String cameraDescriptor = recordReference.split("_")[1];
        return Long.valueOf(cameraDescriptor.substring(CAMERA.length()));
    }

    public static Long extractTimestamp(String recordReference) {
        String filename = recordReference.substring(0, recordReference.lastIndexOf("."));
        return Long.valueOf(filename.split("_")[2]);
    }

}
