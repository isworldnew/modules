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

    private UserResponse safetyOfficer;

    private ReportResponse report; // то, что от safetyOfficer

    private UserResponse foreman; // кто отреагировал на инцидент

//    private ? response; // сама реакция на инцидент
}
