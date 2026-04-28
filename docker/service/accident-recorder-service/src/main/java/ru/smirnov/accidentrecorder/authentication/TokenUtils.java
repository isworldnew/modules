package ru.smirnov.accidentrecorder.authentication;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class TokenUtils {

    @Value("${jwt.secret}")
    private String secret;

    public String extractUsername(String token) {
        return this.extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getSigningKey()) // с использованием секретного ключа
                .build()
                .parseClaimsJws(token) // автоматически проверяем подпись токена
                .getBody();
    }

    public boolean isTokenExpired(String token) {
        return this.extractExpiration(token).before(new Date());
    }

    public Date extractExpiration(String token) {
        return this.extractClaim(token, Claims::getExpiration);
    }

    public boolean validateJwtToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !this.isTokenExpired(token));
    }

    public Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public boolean tokenPresentsType(String token, JwtToken jwtToken) {
        String tokenType = this.extractClaim(token, claims -> (String) claims.get("tokenType"));
        return jwtToken.name().equals(tokenType);
    }

}
