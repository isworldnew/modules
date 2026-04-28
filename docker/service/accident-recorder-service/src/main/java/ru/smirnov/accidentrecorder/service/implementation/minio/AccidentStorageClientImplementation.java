package ru.smirnov.accidentrecorder.service.implementation.minio;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import ru.smirnov.accidentrecorder.service.abstraction.minio.AccidentStorageClient;

import java.io.ByteArrayOutputStream;
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

    @Override
    @SneakyThrows
    public byte[] getRecordAsBytes(String bucketName, String objectName) {
        try (InputStream inputStream = accidentStorageClient.getObject(
                GetObjectArgs.builder()
                        .bucket(bucketName)
                        .object(objectName)
                        .build()
        )) {
            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            byte[] data = new byte[8192];
            int bytesRead;
            while ((bytesRead = inputStream.read(data, 0, data.length)) != -1) {
                buffer.write(data, 0, bytesRead);
            }
            return buffer.toByteArray();
        }
    }
}
