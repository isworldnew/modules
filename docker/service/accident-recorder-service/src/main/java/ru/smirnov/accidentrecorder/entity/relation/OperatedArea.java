package ru.smirnov.accidentrecorder.entity.relation;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.smirnov.accidentrecorder.entity.audience.User;
import ru.smirnov.accidentrecorder.entity.domain.Area;

@Entity
@Table(name = "operated_areas")
@Data @NoArgsConstructor
public class OperatedArea {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "safety_officer_id")
    @JsonBackReference
    private User safetyOfficer;

    @ManyToOne
    @JoinColumn(name = "foreman_id")
    @JsonBackReference
    private User foreman;

    @ManyToOne
    @JoinColumn(name = "area_id")
    @JsonBackReference
    private Area area;

}
