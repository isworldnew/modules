package ru.smirnov.accidentrecorder.service.implementation.minio;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import ru.smirnov.accidentrecorder.service.abstraction.minio.EntryRecordStorageClient;
import ru.smirnov.accidentrecorder.util.MinioPathUtil;

import java.io.InputStream;

@Service
public class EntryRecordStorageClientImplementation implements EntryRecordStorageClient {

    private final MinioClient entryRecordStorageMinioClient;

    @Autowired
    public EntryRecordStorageClientImplementation(
            @Qualifier("entryRecordStorageClient") MinioClient entryRecordStorageMinioClient
    ) {
        this.entryRecordStorageMinioClient = entryRecordStorageMinioClient;
    }

    @Override
    @SneakyThrows
    public InputStream downloadRecord(String reference) {
        return this.entryRecordStorageMinioClient.getObject(
                GetObjectArgs.builder()
                        .bucket(MinioPathUtil.extractBucketName(reference))
                        .object(MinioPathUtil.extractObjectName(reference))
                        .build()
        );
    }

}
