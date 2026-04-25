package ru.smirnov.accidentrecorder.entity.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "accident_reports")
public class AccidentReport {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "accident_id")
    @JsonBackReference
    private PotentialAccident accident;

    @Column(columnDefinition = "TEXT", nullable = true)
    private String description;

    // AccidentInterpretation

    // AccidentType

}
