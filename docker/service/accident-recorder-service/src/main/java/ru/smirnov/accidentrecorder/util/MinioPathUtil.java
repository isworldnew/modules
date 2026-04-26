package ru.smirnov.accidentrecorder.util;

import org.springframework.stereotype.Component;

@Component
public class MinioPathUtil {

    public static String extractBucketName(String reference) {
        return reference.split("/")[0];
    }

    public static String extractObjectName(String reference) {
        return reference.split("/")[1];
    }

    public static String generateFormattedReference(String bucketName, String objectNameWithBlanks) {
        return (bucketName + "/" + (objectNameWithBlanks.replace(" ", "_")));
    }

    public static String generateFormattedReference(String bucketName, Long parentEntityId, Long childEntityId) {
        return (bucketName + "/" + parentEntityId + "_" + childEntityId);
    }

}
