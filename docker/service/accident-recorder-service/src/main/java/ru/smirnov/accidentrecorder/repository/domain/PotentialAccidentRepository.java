package ru.smirnov.accidentrecorder.repository.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.smirnov.accidentrecorder.entity.domain.PotentialAccident;

@Repository
public interface PotentialAccidentRepository extends JpaRepository<PotentialAccident, Long> {

    @Query(
            value = """
                    SELECT
                        COUNT(*)
                    FROM potential_accidents
                    WHERE potential_accidents.safety_officer_id = :id
                    """,
            nativeQuery = true
    )
    Integer countUnprocessedPotentialAccidentsBySafetyOfficerId(@Param("id") Long id);

}
