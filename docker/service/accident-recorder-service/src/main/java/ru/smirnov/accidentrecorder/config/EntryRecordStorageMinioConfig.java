package ru.smirnov.accidentrecorder.config;

import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EntryRecordStorageMinioConfig {

    @Value("${minio.entry.endpoint}")
    private String entryRecordStorageEndpoint;

    @Value("${minio.entry.access-key}")
    private String entryRecordStorageAccessKey;

    @Value("${minio.entry.secret-key}")
    private String entryRecordStorageSecretKey;

    @Bean("entryRecordStorageClient")
    public MinioClient entryRecordStorageClient() {
        return MinioClient.builder()
                .endpoint(this.entryRecordStorageEndpoint)
                .credentials(this.entryRecordStorageAccessKey, this.entryRecordStorageSecretKey)
                .build();
    }

}
