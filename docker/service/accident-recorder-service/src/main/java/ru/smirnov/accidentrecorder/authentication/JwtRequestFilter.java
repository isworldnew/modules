package ru.smirnov.accidentrecorder.authentication;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private final UserDetailsService userDetailsService;
    private final TokenUtils tokenUtils;

    @Autowired
    public JwtRequestFilter(UserDetailsService userDetailsService, TokenUtils tokenUtils) {
        this.userDetailsService = userDetailsService;
        this.tokenUtils = tokenUtils;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwtToken = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwtToken = authorizationHeader.substring(7);
            try {
                username = this.tokenUtils.extractUsername(jwtToken);
            }
            catch (ExpiredJwtException eje) {
                response.setStatus(HttpStatus.FORBIDDEN.value());
                response.setContentType("application/json");
                response.getWriter().write("{\"exceptionMessage\": \"" + "Token has been expired" + "\"}");
                return;
            }
            catch (Exception e) {
                response.setStatus(HttpStatus.FORBIDDEN.value());
                response.setContentType("application/json");
                response.getWriter().write("{\"exceptionMessage\": \"" + "Invalid token: unable to extract username from token" + "\"}");
                return;
            }
        }


        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            try {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

                if (tokenUtils.validateJwtToken(jwtToken, userDetails)) {

                    Claims claims = tokenUtils.extractAllClaims(jwtToken);
                    List<SimpleGrantedAuthority> authorities = ((List<Map<String, String>>) claims.get("authorities")).stream()
                            .map(authority -> new SimpleGrantedAuthority(authority.get("authority")))
                            .collect(Collectors.toList());


                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, authorities);
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    if (!userDetails.isEnabled()) {
                        response.setStatus(HttpStatus.FORBIDDEN.value());
                        response.setContentType("application/json");
                        response.getWriter().write("{\"exceptionMessage\": \"" + "Account became DISABLED after generating this token" + "\"}");
                        return;
                    }

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }

            } catch (Exception e) {
                response.setStatus(HttpStatus.FORBIDDEN.value());
                response.setContentType("application/json");
                response.getWriter().write("{\"exceptionMessage\": \"" + "Invalid token: unable to load data by username or validation fail" + "\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

}
