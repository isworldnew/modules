package ru.smirnov.accidentrecorder.config;

import lombok.Getter;

@Getter
public enum MinioBuckets {

    ACCIDENTS("accidents");

    private final String bucketName;

    MinioBuckets(String bucketName) {
        this.bucketName = bucketName;
    }

}
