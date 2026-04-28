package ru.smirnov.accidentrecorder.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor
public class AccidentResponse {

    private Long id;

    private String areaName;

    private String cameraName;

    private String uploadDateTime;

    private String recordDateTime;

    private String accidentDateTime;

    private Double supposedAccuracy;

    private String recordType;

    private byte[] record;

    private String status;

    private SafetyOfficerResponse safetyOfficer;

    private ReportResponse report;
}
