package ru.smirnov.accidentrecorder.projection.abstraction;

public interface AccidentReportShortcutResponse {

    Long getPotentialAccidentId();

    Long getAccidentReportId();

    String getReportStatus();

    String getAreaName();

    String getUploadDateTime();
}
