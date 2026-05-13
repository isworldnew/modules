package ru.smirnov.accidentrecorder.entity.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.TrespasserRelation;

import java.util.List;

@Entity
@Table(name = "trespassers")
@Data @NoArgsConstructor
public class Trespasser {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(
            mappedBy = "trespasser",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonManagedReference
    private List<Response> responses;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String trespasserName;

    @Column(columnDefinition = "VARCHAR(255)", nullable = true)
    private String post;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(255)", nullable = false)
    private TrespasserRelation trespasserRelation;

    @Column(columnDefinition = "VARCHAR(255)", nullable = false)
    private String organizationEmail;

}
