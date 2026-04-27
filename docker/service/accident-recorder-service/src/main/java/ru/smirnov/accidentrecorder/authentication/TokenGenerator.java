package ru.smirnov.accidentrecorder.authentication;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import ru.smirnov.accidentrecorder.dto.request.LoginRequest;
import ru.smirnov.accidentrecorder.dto.response.JwtResponse;

import java.util.*;

@Component
public class TokenGenerator {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final TokenUtils tokenUtils;

    @Autowired
    public TokenGenerator(
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService,
            TokenUtils tokenUtils
    ) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.tokenUtils = tokenUtils;
    }

    public ResponseEntity<JwtResponse> createTokens(LoginRequest dto) {
        this.authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword())
        );

        UserDetails dataForToken = this.userDetailsService.loadUserByUsername(dto.getUsername());

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new JwtResponse(
                        this.generateJwtToken(dataForToken, JwtToken.ACCESS_TOKEN),
                        this.generateJwtToken(dataForToken, JwtToken.REFRESH_TOKEN)
                )
        );
    }

    private String generateJwtToken(UserDetails userDetails, JwtToken jwtToken) {

        Map<String, Object> claims = new HashMap<>();

        if (userDetails instanceof DataForToken dataForToken) {
            List<SimpleGrantedAuthority> authorities = new ArrayList<>(dataForToken.getAuthorities());

            authorities.add(new SimpleGrantedAuthority(jwtToken.name()));

            claims.put("userId", dataForToken.getUserId());
            claims.put("role", dataForToken.getRole());
            claims.put("authorities", authorities);
        }

        return Jwts.builder()
                .claims(claims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtToken.getValidityDuration()))
                .signWith(this.tokenUtils.getSigningKey(), SignatureAlgorithm.HS256)
                .compact();

    }


    public ResponseEntity<JwtResponse> refreshTokens() {
        UserDetails dataForToken = this.userDetailsService.loadUserByUsername(
                SecurityContextHolder.getContext().getAuthentication().getName()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new JwtResponse(
                        this.generateJwtToken(dataForToken, JwtToken.ACCESS_TOKEN),
                        this.generateJwtToken(dataForToken, JwtToken.REFRESH_TOKEN)
                )
        );
    }

}
