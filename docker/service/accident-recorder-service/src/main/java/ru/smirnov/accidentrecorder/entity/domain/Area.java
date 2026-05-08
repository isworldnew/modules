package ru.smirnov.accidentrecorder.entity.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.smirnov.accidentrecorder.entity.relation.OperatedArea;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "areas")
@Data @NoArgsConstructor
public class Area {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "VARCHAR(255)", nullable = false)
    private String name;

    @OneToMany(
            mappedBy = "area",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonManagedReference
    private List<Camera> cameras = new ArrayList<>();

    @OneToMany(
          mappedBy = "area",
          cascade = CascadeType.ALL,
          orphanRemoval = true
    )
    @JsonManagedReference
    private List<PotentialAccident> potentialAccidents = new ArrayList<>();

    @OneToMany(
           mappedBy = "area",
           cascade = CascadeType.ALL,
           orphanRemoval = true
    )
    @JsonManagedReference
    private List<OperatedArea> operators = new ArrayList<>();

}
