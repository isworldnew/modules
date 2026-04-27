package ru.smirnov.accidentrecorder.entity.audience;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.Role;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.UserStatus;

@Entity
@Table(name = "users")
@Data @NoArgsConstructor
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "VARCHAR(255)", nullable = false, unique = true)
    private String username;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(255)", nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(255) DEFAULT 'ENABLED'", nullable = false)
    private UserStatus status = UserStatus.ENABLED;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String firstname;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String lastname;

    @Column(columnDefinition = "TEXT", nullable = true)
    private String parentname;
}
