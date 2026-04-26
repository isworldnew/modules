package ru.smirnov.accidentrecorder.entity.mongo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class Track {

    private Double time;

    private Double cx;

    private Double cy;

    private Integer w;

    private Integer h;
}
