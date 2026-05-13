package ru.smirnov.accidentrecorder.repository.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.smirnov.accidentrecorder.entity.domain.Area;

import java.util.Optional;

@Repository
public interface AreaRepository extends JpaRepository<Area, Long> {

    @Query(
            value = """
                    SELECT * FROM areas
                    WHERE areas.foreman_id = :foremanId
                    """,
            nativeQuery = true
    )
    Optional<Area> getAreaByForemanId(@Param("foremanId") Long foremanId);

}
