package ru.smirnov.accidentrecorder.service.implementation.minio;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import ru.smirnov.accidentrecorder.service.abstraction.minio.AccidentStorageClient;

import java.io.InputStream;

@Service
public class AccidentStorageClientImplementation implements AccidentStorageClient {

    private final MinioClient accidentStorageClient;

    @Autowired
    public AccidentStorageClientImplementation(@Qualifier("accidentStorageClient") MinioClient accidentStorageClient) {
        this.accidentStorageClient = accidentStorageClient;
    }

    @Override
    @SneakyThrows
    public void saveRecord(String bucketName, String objectName, InputStream inputStream, String contentType) {
        accidentStorageClient.putObject(
                PutObjectArgs.builder()
                        .bucket(bucketName)
                        .object(objectName)
                        .stream(inputStream, inputStream.available(), -1)
                        .contentType(contentType)
                        .build()
        );
    }

}
