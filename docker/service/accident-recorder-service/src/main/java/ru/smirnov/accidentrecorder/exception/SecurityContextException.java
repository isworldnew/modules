package ru.smirnov.accidentrecorder.exception;

public class SecurityContextException extends RuntimeException {
    public SecurityContextException(String message) {
        super(message);
    }
}
