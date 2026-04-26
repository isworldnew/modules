package ru.smirnov.accidentrecorder.repository.audience;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.smirnov.accidentrecorder.entity.audience.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
