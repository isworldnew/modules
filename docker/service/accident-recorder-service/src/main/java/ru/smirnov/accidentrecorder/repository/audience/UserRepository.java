package ru.smirnov.accidentrecorder.repository.audience;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.smirnov.accidentrecorder.entity.audience.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT user FROM User user WHERE user.username = :username")
    Optional<User> findByUsername(String username);

    @Query(
            value = """
                    SELECT
                        id
                    FROM users
                    WHERE users.role = 'SAFETY_OFFICER' AND users.status = 'ENABLED'
                    """,
            nativeQuery = true
    )
    List<Long> getEnabledSafetyOfficerIdentifiers();


    @Query(
            value = """
                    SELECT DISTINCT u.*
                    FROM users u
                    WHERE (
                        (:searchRequest IS NULL OR :searchRequest = '')\s
                        OR LOWER(u.lastname) LIKE LOWER(CONCAT('%', :searchRequest, '%'))
                        OR LOWER(u.firstname) LIKE LOWER(CONCAT('%', :searchRequest, '%'))
                        OR LOWER(u.parentname) LIKE LOWER(CONCAT('%', :searchRequest, '%'))
                        OR LOWER(u.username) LIKE LOWER(CONCAT('%', :searchRequest, '%'))
                    )
                    AND
                        u.role = :role
                    ORDER BY u.id
                    """,
            nativeQuery = true
    )
    List<User> usersSearch(@Param("searchRequest") String searchRequest, @Param("role") String role);
}
