package ru.smirnov.accidentrecorder.entity.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.AccidentInterpretation;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.AccidentType;

@Entity
@Table(name = "accident_reports")
@Data @NoArgsConstructor
public class AccidentReport {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "accident_id")
    @JsonBackReference
    private PotentialAccident accident;

    @Column(columnDefinition = "TEXT", nullable = true)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(255)", nullable = false)
    private AccidentInterpretation accidentInterpretation;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(255)", nullable = false)
    private AccidentType accidentType;

}
