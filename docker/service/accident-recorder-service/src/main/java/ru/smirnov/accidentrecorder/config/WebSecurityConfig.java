package ru.smirnov.accidentrecorder.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import ru.smirnov.accidentrecorder.authentication.JwtRequestFilter;
import ru.smirnov.accidentrecorder.authentication.JwtToken;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtRequestFilter jwtRequestFilter;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public WebSecurityConfig(
            UserDetailsService userDetailsService,
            JwtRequestFilter jwtRequestFilter,
            BCryptPasswordEncoder bCryptPasswordEncoder
    ) {
        this.userDetailsService = userDetailsService;
        this.jwtRequestFilter = jwtRequestFilter;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider daoAP = new DaoAuthenticationProvider(userDetailsService);
        daoAP.setPasswordEncoder(this.bCryptPasswordEncoder);
        return daoAP;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.
                cors(cors -> cors.configurationSource(this.corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/authentication/login", "/api/error").permitAll()
                        .requestMatchers("/api/authentication/refresh").hasAuthority(JwtToken.REFRESH_TOKEN.name())
                        .anyRequest().hasAuthority(JwtToken.ACCESS_TOKEN.name())
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(this.daoAuthenticationProvider())
                .addFilterBefore(this.jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5555",
                "http://127.0.0.1:5555"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
