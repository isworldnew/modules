package ru.smirnov.accidentrecorder.entity.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.AccidentStatus;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "potential_accidents")
@Data @NoArgsConstructor
public class PotentialAccident {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "area_id")
    @JsonBackReference
    private Area area;

    @ManyToOne
    @JoinColumn(name = "camera_id")
    @JsonBackReference
    private Camera camera;

    @Column(name = "upload_date_time", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", nullable = false)
    private OffsetDateTime uploadDateTime = OffsetDateTime.now();

    // время начала видеозаписи (timestamp из названия)
    @Column(name = "record_start_date_time", columnDefinition = "TIMESTAMP", nullable = false)
    private OffsetDateTime recordStartDateTime;

    @Column(name = "accident_date_time", columnDefinition = "TIMESTAMP", nullable = false)
    private OffsetDateTime accidentDateTime;

    @Column(name = "supposed_accuracy", columnDefinition = "NUMERIC(20, 18)", nullable = false)
    private Double supposedAccuracy;

    @Column(name = "record_reference", columnDefinition = "TEXT", nullable = true)
    private String recordReference;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "VARCHAR(255) DEFAULT 'UNPROCESSED'", nullable = false)
    private AccidentStatus status = AccidentStatus.UNPROCESSED;

    @OneToOne(
            mappedBy = "accident",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonManagedReference
    private AccidentReport report;

    // ссылка на safety_officer, потому что назначается уведомление
    // авторство, будем считать, числится за этим же сотрудником

}
