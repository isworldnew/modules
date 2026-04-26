package ru.smirnov.accidentrecorder.service.abstraction.minio;

import java.io.InputStream;

public interface AccidentStorageClient {

    void saveRecord(String bucketName, String objectName, InputStream inputStream, String contentType);
}
