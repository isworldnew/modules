package ru.smirnov.accidentrecorder.entity.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.ResponseType;

@Entity
@Table(name = "responses")
@Data @NoArgsConstructor
public class Response {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private AccidentReport report;

    @Enumerated(EnumType.STRING)
    private ResponseType responseType;

    private String responseReport;

    @OneToOne
    @JoinColumn(name = "accident_report_id")
    private AccidentReport accidentReport;

    @ManyToOne
    @JoinColumn(name = "trespasser_id", nullable = true)
    private Trespasser trespasser;

}
