package ru.smirnov.accidentrecorder.config;

import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AccidentStorageMinioConfig {

    @Value("${minio.accident.endpoint}")
    private String accidentStorageEndpoint;

    @Value("${minio.accident.access-key}")
    private String accidentStorageAccessKey;

    @Value("${minio.accident.secret-key}")
    private String accidentStorageSecretKey;

    @Bean("accidentStorageClient")
    public MinioClient accidentStorageClient() {
        return MinioClient.builder()
                .endpoint(this.accidentStorageEndpoint)
                .credentials(this.accidentStorageAccessKey, this.accidentStorageSecretKey)
                .build();
    }

}
