package ru.smirnov.accidentrecorder.repository.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.smirnov.accidentrecorder.entity.domain.AccidentReport;
import ru.smirnov.accidentrecorder.projection.abstraction.AccidentReportShortcutResponse;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface AccidentReportRepository extends JpaRepository<AccidentReport, Long> {

    @Query(
            value = """
                    SELECT
                        potential_accidents.id AS potential_accident_id,
                        accident_reports.id AS accident_report_id,
                        accident_reports.report_status AS report_status,
                        areas.name AS area_name,
                        TO_CHAR(accident_reports.upload_date_time, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS upload_date_time
                    FROM accident_reports
                    
                    INNER JOIN potential_accidents
                    ON potential_accidents.area_id = :areaId
                    
                    INNER JOIN areas
                    ON potential_accidents.area_id = areas.id
                    
                    WHERE accident_reports.report_status = 'UNPROCESSED_BY_FOREMAN'
                    """,
            nativeQuery = true
    )
    List<AccidentReportShortcutResponse> getUnprocessedAccidentReportsByAreaId(@Param("areaId") Long areaId);

    @Query(
            value = """
                    SELECT
                        potential_accidents.id AS potential_accident_id,
                        accident_reports.id AS accident_report_id,
                        accident_reports.report_status AS report_status,
                        areas.name AS area_name,
                        TO_CHAR(accident_reports.upload_date_time, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS upload_date_time
                    FROM accident_reports
                    
                    INNER JOIN potential_accidents
                    ON potential_accidents.area_id = :areaId
                    
                    INNER JOIN areas
                    ON potential_accidents.area_id = areas.id
                    
                    WHERE
                        accident_reports.report_status = 'PROCESSED_BY_FOREMAN'
                    AND
                        accident_reports.upload_date_time BETWEEN :dateFrom AND :dateTo
                    ORDER BY accident_reports.upload_date_time DESC
                    """,
            nativeQuery = true
    )
    List<AccidentReportShortcutResponse> getProcessedAccidentReportsByAreaIdAndDateTimeRange(
            @Param("areaId") Long areaId,
            @Param("dateFrom") OffsetDateTime dateFrom,
            @Param("dateTo") OffsetDateTime dateTo
    );


}
