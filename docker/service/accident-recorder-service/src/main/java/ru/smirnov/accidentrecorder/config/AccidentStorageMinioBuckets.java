package ru.smirnov.accidentrecorder.config;

import lombok.Getter;

@Getter
public enum AccidentStorageMinioBuckets {

    ACCIDENTS("accidents"),
    DOCUMENTS("documents");

    private final String bucketName;

    AccidentStorageMinioBuckets(String bucketName) {
        this.bucketName = bucketName;
    }

}
