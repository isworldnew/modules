package ru.smirnov.accidentrecorder.repository.relation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.smirnov.accidentrecorder.entity.relation.OperatedArea;

@Repository
public interface OperatedAreaRepository extends JpaRepository<OperatedArea, Long> {
}
