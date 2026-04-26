package ru.smirnov.accidentrecorder.message;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data @NoArgsConstructor
public class AccidentMessage {

    @JsonProperty("object_id")
    private String objectId;

    @JsonProperty("class")
    private String supposedClass;

    @JsonProperty("class_id")
    private Integer classId;

    @JsonProperty("avg_confidence")
    private Double averageConfidence;

    public VestClassification getVestClassificationResult() {
        return VestClassification.valueOf(this.supposedClass);
    }

}
