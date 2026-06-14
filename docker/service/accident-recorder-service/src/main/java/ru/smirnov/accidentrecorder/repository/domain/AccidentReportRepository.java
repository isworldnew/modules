package ru.smirnov.accidentrecorder.repository.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.smirnov.accidentrecorder.entity.domain.AccidentReport;
import ru.smirnov.accidentrecorder.projection.abstraction.AccidentReportShortcutResponse;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccidentReportRepository extends JpaRepository<AccidentReport, Long> {

    Optional<AccidentReport> findByAccidentId(Long accidentId);

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
                    ON potential_accidents.id = accident_reports.accident_id
                    
                    INNER JOIN areas
                    ON potential_accidents.area_id = areas.id
                    
                    WHERE
                        potential_accidents.area_id = :areaId
                    AND
                        accident_reports.report_status = 'UNPROCESSED_BY_FOREMAN'
                    AND
                        accident_reports.accident_interpretation = 'REAL_ALARM'
                    
                    ORDER BY accident_reports.upload_date_time DESC
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
                    ON potential_accidents.id = accident_reports.accident_id
                    
                    INNER JOIN areas
                    ON potential_accidents.area_id = areas.id
                    
                    WHERE
                        potential_accidents.area_id = :areaId
                    AND
                        accident_reports.report_status = 'PROCESSED_BY_FOREMAN'
                    AND
                        accident_reports.accident_interpretation = 'REAL_ALARM'
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
                    ON potential_accidents.id = accident_reports.accident_id
                    
                    INNER JOIN areas
                    ON potential_accidents.area_id = areas.id
                    
                    WHERE
                        accident_reports.report_status = 'PROCESSED_BY_FOREMAN'
                    AND
                        accident_reports.accident_interpretation = 'REAL_ALARM'
                    AND
                        accident_reports.upload_date_time BETWEEN :dateFrom AND :dateTo
                    ORDER BY accident_reports.upload_date_time DESC
                    """,
            nativeQuery = true
    )
    List<AccidentReportShortcutResponse> getProcessedAccidentReportsByDateTimeRange(
            @Param("dateFrom") OffsetDateTime dateFrom,
            @Param("dateTo") OffsetDateTime dateTo
    );

    @Query(
            value = """
        SELECT
            potential_accidents.id AS potential_accident_id,
            accident_reports.id AS accident_report_id,
            accident_reports.report_status AS report_status,
            areas.name AS area_name,
            TO_CHAR(accident_reports.upload_date_time, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS upload_date_time,
            responses.documented_response AS documented
        FROM accident_reports
        
        INNER JOIN potential_accidents
        ON potential_accidents.id = accident_reports.accident_id
        
        INNER JOIN areas
        ON potential_accidents.area_id = areas.id
        
        INNER JOIN responses
        ON responses.accident_report_id = accident_reports.id
        
        WHERE
            accident_reports.report_status = 'PROCESSED_BY_FOREMAN'
        AND
            accident_reports.accident_interpretation = 'REAL_ALARM'
        AND
            responses.documented_response = :documented
        
        ORDER BY accident_reports.upload_date_time DESC
        """,
            nativeQuery = true
    )
    List<AccidentReportShortcutResponse> getProcessedAccidentReportsByDocumentedStatus(
            @Param("documented") String documented
    );

    @Query(
            value = """
        SELECT
            potential_accidents.id AS potential_accident_id,
            accident_reports.id AS accident_report_id,
            accident_reports.report_status AS report_status,
            areas.name AS area_name,
            TO_CHAR(accident_reports.upload_date_time, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS upload_date_time,
            responses.documented_response AS documented
        FROM accident_reports
        
        INNER JOIN potential_accidents
        ON potential_accidents.id = accident_reports.accident_id
        
        INNER JOIN areas
        ON potential_accidents.area_id = areas.id
        
        INNER JOIN responses
        ON responses.accident_report_id = accident_reports.id
        
        WHERE
            accident_reports.report_status = 'PROCESSED_BY_FOREMAN'
        AND
            accident_reports.accident_interpretation = 'REAL_ALARM'
        AND
            responses.documented_response = :documented
        AND
            accident_reports.upload_date_time BETWEEN :dateFrom AND :dateTo
        
        ORDER BY accident_reports.upload_date_time DESC
        """,
            nativeQuery = true
    )
    List<AccidentReportShortcutResponse> getProcessedAccidentReportsByDateTimeRangeAndDocumentedStatus(
            @Param("dateFrom") OffsetDateTime dateFrom,
            @Param("dateTo") OffsetDateTime dateTo,
            @Param("documented") String documented
    );

    @Query(
            value = """
        SELECT
            potential_accidents.id AS potential_accident_id,
            accident_reports.id AS accident_report_id,
            accident_reports.report_status AS report_status,
            areas.name AS area_name,
            TO_CHAR(accident_reports.upload_date_time, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS upload_date_time,
            responses.documented_response AS documented
        FROM accident_reports
        
        INNER JOIN potential_accidents
        ON potential_accidents.id = accident_reports.accident_id
        
        INNER JOIN areas
        ON potential_accidents.area_id = areas.id
        
        INNER JOIN responses
        ON responses.accident_report_id = accident_reports.id
        
        WHERE
            accident_reports.report_status = 'PROCESSED_BY_FOREMAN'
        AND
            accident_reports.accident_interpretation = 'REAL_ALARM'
        AND
            responses.documented_response = :documented
        AND
            potential_accidents.area_id = :areaId
        AND
            accident_reports.upload_date_time BETWEEN :dateFrom AND :dateTo
        
        ORDER BY accident_reports.upload_date_time DESC
        """,
            nativeQuery = true
    )
    List<AccidentReportShortcutResponse> getProcessedAccidentReportsByAreaIdAndDateTimeRangeAndDocumentedStatus(
            @Param("areaId") Long areaId,
            @Param("dateFrom") OffsetDateTime dateFrom,
            @Param("dateTo") OffsetDateTime dateTo,
            @Param("documented") String documented
    );

    @Query(
            value = """
        SELECT
            potential_accidents.id AS potential_accident_id,
            accident_reports.id AS accident_report_id,
            accident_reports.report_status AS report_status,
            areas.name AS area_name,
            TO_CHAR(accident_reports.upload_date_time, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS upload_date_time,
            responses.documented_response AS documented
        FROM accident_reports
        
        INNER JOIN potential_accidents
        ON potential_accidents.id = accident_reports.accident_id
        
        INNER JOIN areas
        ON potential_accidents.area_id = areas.id
        
        INNER JOIN responses
        ON responses.accident_report_id = accident_reports.id
        
        WHERE
            accident_reports.report_status = 'PROCESSED_BY_FOREMAN'
        AND
            accident_reports.accident_interpretation = 'REAL_ALARM'
        AND
            responses.documented_response = :documented
        AND
            potential_accidents.area_id = :areaId
        
        ORDER BY accident_reports.upload_date_time DESC
        """,
            nativeQuery = true
    )
    List<AccidentReportShortcutResponse> getProcessedAccidentReportsByAreaIdAndDocumentedStatus(
            @Param("areaId") Long areaId,
            @Param("documented") String documented
    );

    @Query(
            value = """
        SELECT
            potential_accidents.id AS potential_accident_id,
            accident_reports.id AS accident_report_id,
            accident_reports.report_status AS report_status,
            areas.name AS area_name,
            TO_CHAR(accident_reports.upload_date_time, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS upload_date_time,
            responses.documented_response AS documented
        FROM accident_reports
        
        INNER JOIN potential_accidents
        ON potential_accidents.id = accident_reports.accident_id
        
        INNER JOIN areas
        ON potential_accidents.area_id = areas.id
        
        INNER JOIN responses
        ON responses.accident_report_id = accident_reports.id
        
        INNER JOIN trespassers
        ON responses.trespasser_id = trespassers.id
        
        WHERE
            accident_reports.report_status = 'PROCESSED_BY_FOREMAN'
        AND
            accident_reports.accident_interpretation = 'REAL_ALARM'
        AND
            responses.documented_response = 'DOCUMENTED'
        AND
            trespassers.id = :trespasserId
        
        ORDER BY accident_reports.upload_date_time DESC
        """,
            nativeQuery = true
    )
    List<AccidentReportShortcutResponse> getDocumentedEventsByTrespasserId(
            @Param("trespasserId") Long trespasserId
    );
}
