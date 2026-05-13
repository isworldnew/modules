package ru.smirnov.accidentrecorder.entity.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.AccidentInterpretation;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.AccidentType;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.ReportStatus;

import java.time.OffsetDateTime;

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

    @OneToOne(
            mappedBy = "accidentReport",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonManagedReference
    private Response response;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(255)", nullable = false)
    private ReportStatus reportStatus = ReportStatus.UNPROCESSED_BY_FOREMAN;

    @Column(name = "upload_date_time", columnDefinition = "TIMESTAMP", nullable = false)
    private OffsetDateTime uploadDateTime = OffsetDateTime.now();

}
