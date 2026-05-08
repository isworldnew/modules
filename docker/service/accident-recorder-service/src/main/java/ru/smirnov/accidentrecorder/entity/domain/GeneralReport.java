package ru.smirnov.accidentrecorder.entity.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.smirnov.accidentrecorder.entity.audience.User;

@Entity
@Table(name = "general_reports")
@Data @NoArgsConstructor
public class GeneralReport {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "foreman_id")
    @JsonBackReference
    private User foreman;

    // ну тут описать всю хуйню, нужную для отчёта

}
