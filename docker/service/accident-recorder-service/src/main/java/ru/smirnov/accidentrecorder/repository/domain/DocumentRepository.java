package ru.smirnov.accidentrecorder.repository.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.smirnov.accidentrecorder.entity.domain.Document;
import ru.smirnov.accidentrecorder.projection.abstraction.DocumentProjection;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    Optional<Document> findByResponseId(Long responseId);

    @Query(
            value = """
                SELECT
                    documents.id AS document_id,
                    documents.document_reference AS document_reference,
                    documents.document_type AS document_type,
                    potential_accidents.accident_date_time AS accident_date_time
                FROM documents
                INNER JOIN responses ON responses.id = documents.response_id
                INNER JOIN accident_reports ON accident_reports.id = responses.accident_report_id
                INNER JOIN potential_accidents ON potential_accidents.id = accident_reports.accident_id
                WHERE
                    accident_reports.report_status = 'PROCESSED_BY_FOREMAN'
                    AND accident_reports.accident_interpretation = 'REAL_ALARM'
                    AND responses.documented_response = 'DOCUMENTED'
                    AND potential_accidents.accident_date_time BETWEEN :dateFrom AND :dateTo
                ORDER BY potential_accidents.accident_date_time DESC
            """,
            nativeQuery = true
    )
    List<DocumentProjection> getDocumentsByDateTimeRange(
            @Param("dateFrom") OffsetDateTime dateFrom,
            @Param("dateTo") OffsetDateTime dateTo
    );
}
