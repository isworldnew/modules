package ru.smirnov.accidentrecorder.repository.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.smirnov.accidentrecorder.entity.domain.Trespasser;

import java.util.List;

@Repository
public interface TrespasserRepository extends JpaRepository<Trespasser, Long> {

    @Query(
            value = """
                    SELECT * FROM trespassers
                    WHERE LOWER(trespasser_name) LIKE LOWER(CONCAT('%', :searchRequest, '%'))
                    """,
            nativeQuery = true
    )
    List<Trespasser> searchByNameNative(@Param("searchRequest") String searchRequest);

}
