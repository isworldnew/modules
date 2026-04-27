package ru.smirnov.accidentrecorder.entity.audience;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.Role;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.UserStatus;

@Entity
@Table(name = "users")
@Data @NoArgsConstructor
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(255)", nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(255) DEFAULT 'ENABLED'", nullable = false)
    private UserStatus status = UserStatus.ENABLED;

    // почта

    // пароль

    // фио

}
