package ru.smirnov.accidentrecorder.service.implementation.audience;

import org.apache.commons.lang3.NotImplementedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import ru.smirnov.accidentrecorder.authentication.DataForToken;
import ru.smirnov.accidentrecorder.dto.request.UserCreationRequest;
import ru.smirnov.accidentrecorder.dto.response.UserResponse;
import ru.smirnov.accidentrecorder.entity.audience.User;
import ru.smirnov.accidentrecorder.exception.ConflictException;
import ru.smirnov.accidentrecorder.mapper.abstraction.UserMapper;
import ru.smirnov.accidentrecorder.repository.audience.UserRepository;
import ru.smirnov.accidentrecorder.service.abstraction.audience.UserService;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class UserServiceImplementation implements UserDetailsService, UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public UserServiceImplementation(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.userMapper = userMapper;
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

    @Override
    public UserResponse getUserData(DataForToken tokenData) {
        User user = this.userRepository.findById(tokenData.getUserId()).orElseThrow(
                () -> new UsernameNotFoundException("No user with id=" + tokenData.getUserId())
        );

        return this.userMapper.userEntityToUserResponse(user);
    }

    @Override
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public Long createUser(UserCreationRequest dto) {

        User userFoundByUsername = this.userRepository.findByUsername(dto.getUsername()).orElse(null);

        if (userFoundByUsername != null)
            throw new ConflictException("User with username='" + dto.getUsername() + "' already exists");

        User user = this.userMapper.userCreationRequestToUserEntity(dto, this.bCryptPasswordEncoder.encode(dto.getPassword()));

        this.userRepository.save(user);

        return user.getId();
    }

    @Override
    public List<UserResponse> usersSearch(String searchRequest, String role) {
        List<User> users = this.userRepository.usersSearch(searchRequest, role.toUpperCase());

        return users.stream()
                .map(this.userMapper::userEntityToUserResponse)
                .toList();
    }

    @Override
    public List<UserResponse> getFreeForemans() {
        return this.userRepository.getFreeForemans().stream()
                .map(this.userMapper::userEntityToUserResponse)
                .toList();
    }
}
