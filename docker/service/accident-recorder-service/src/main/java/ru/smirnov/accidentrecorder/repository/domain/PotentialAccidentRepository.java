package ru.smirnov.accidentrecorder.repository.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.smirnov.accidentrecorder.projection.abstraction.AccidentShortcutResponse;
import ru.smirnov.accidentrecorder.entity.domain.PotentialAccident;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface PotentialAccidentRepository extends JpaRepository<PotentialAccident, Long> {

    @Query(
            value = """
                    SELECT
                        COUNT(*)
                    FROM potential_accidents
                    WHERE
                        potential_accidents.safety_officer_id = :id
                    AND
                        potential_accidents.status = 'UNPROCESSED'
                    """,
            nativeQuery = true
    )
    Integer countUnprocessedPotentialAccidentsBySafetyOfficerId(@Param("id") Long id);

    @Query(
            value = """
                    SELECT
                        potential_accidents.id AS id,
                        areas.name AS area_name,
                        potential_accidents.status AS status,
                        TO_CHAR(potential_accidents.upload_date_time, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS upload_date_time
                    FROM potential_accidents
                    LEFT JOIN areas ON potential_accidents.area_id = areas.id
                    WHERE
                        potential_accidents.safety_officer_id = :safetyOfficerId
                    AND
                        potential_accidents.status = :status
                    AND
                        potential_accidents.upload_date_time BETWEEN :dateFrom AND :dateTo
                    ORDER BY potential_accidents.upload_date_time DESC
                    """,
            nativeQuery = true
    )
    List<AccidentShortcutResponse> getPotentialAccidentShortcutsBySafetyOfficerId(
            @Param("status") String status,
            @Param("safetyOfficerId") Long safetyOfficerId,
            @Param("dateFrom") OffsetDateTime dateFrom,
            @Param("dateTo") OffsetDateTime dateTo
    );

    @Query(
            value = """
                    SELECT
                        potential_accidents.id AS id,
                        areas.name AS area_name,
                        potential_accidents.status AS status,
                        TO_CHAR(potential_accidents.upload_date_time, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS upload_date_time
                    FROM potential_accidents
                    LEFT JOIN areas ON potential_accidents.area_id = areas.id
                    WHERE
                        potential_accidents.status = :status
                    AND
                        potential_accidents.upload_date_time BETWEEN :dateFrom AND :dateTo
                    ORDER BY potential_accidents.upload_date_time DESC
                    """,
            nativeQuery = true
    )
    List<AccidentShortcutResponse> getPotentialAccidentShortcuts(
            @Param("status") String status,
            @Param("dateFrom") OffsetDateTime dateFrom,
            @Param("dateTo") OffsetDateTime dateTo
    );

}
