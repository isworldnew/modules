package ru.smirnov.accidentrecorder.service.implementation.audience;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ru.smirnov.accidentrecorder.authentication.DataForToken;
import ru.smirnov.accidentrecorder.entity.audience.User;
import ru.smirnov.accidentrecorder.repository.audience.UserRepository;
import ru.smirnov.accidentrecorder.service.abstraction.audience.UserService;

import java.util.Collections;
import java.util.List;

@Service
public class UserServiceImplementation implements UserDetailsService, UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public UserServiceImplementation(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = this.userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("No user with username (email) = " + username)
        );

        List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );

        return DataForToken.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .enabled(user.getStatus().isEnabled())
                .authorities(authorities)
                .userId(user.getId())
                .role(user.getRole().name())
                .build();
    }

}
