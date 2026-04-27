package ru.smirnov.accidentrecorder.authentication;

import lombok.Builder;
import lombok.Data;
import lombok.Setter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

@Data @Builder @Setter
public class DataForToken implements UserDetails {

//    private String email;

    private String username;

    private String password;

    private boolean enabled;

    private List<SimpleGrantedAuthority> authorities;

    private Long userId;

    private String role;

//    @Override
//    public String getUsername() {
//        return this.email;
//    }

    @Override
    public boolean isEnabled() {
        return this.enabled;
    }

}
