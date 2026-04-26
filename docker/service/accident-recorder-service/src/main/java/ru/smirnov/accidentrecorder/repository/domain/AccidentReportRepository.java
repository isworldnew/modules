package ru.smirnov.accidentrecorder.repository.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.smirnov.accidentrecorder.entity.domain.AccidentReport;

@Repository
public interface AccidentReportRepository extends JpaRepository<AccidentReport, Long> {
}
