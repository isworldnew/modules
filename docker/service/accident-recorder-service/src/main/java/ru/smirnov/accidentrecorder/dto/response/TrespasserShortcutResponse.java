package ru.smirnov.accidentrecorder.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class TrespasserShortcutResponse {

    private Long id;

    private String name;

    private String post;

    private String relation;

    private String organizationEmail;

    private Integer responsesAmount;
}
