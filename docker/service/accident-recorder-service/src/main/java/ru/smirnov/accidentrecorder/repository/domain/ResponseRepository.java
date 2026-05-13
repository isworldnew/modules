package ru.smirnov.accidentrecorder.repository.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.smirnov.accidentrecorder.entity.domain.Response;

@Repository
public interface ResponseRepository extends JpaRepository<Response, Long> {
}
