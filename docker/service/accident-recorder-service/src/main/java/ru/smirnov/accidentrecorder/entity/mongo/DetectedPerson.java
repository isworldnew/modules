package ru.smirnov.accidentrecorder.entity.mongo;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "detected-persons")
@Data @NoArgsConstructor
public class DetectedPerson {

    @Id
    private String id;

    @Field("video")
    private String recordReference;

    @Field("person_id")
    private Integer personId;

    @Field("start_time")
    private Double startTime;

    @Field("end_time")
    private Double endTime;

    @Field("last_seen")
    private Double lastSeen;

    @Field("track")
    private List<Track> track;

}
