package ru.smirnov.accidentrecorder.exception;

public class DetectedPersonNotFoundException extends RuntimeException {
    public DetectedPersonNotFoundException(String message) {
        super(message);
    }
}
