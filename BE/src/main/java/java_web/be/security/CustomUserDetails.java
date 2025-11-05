package java_web.be.security;

import java_web.be.model.User;
import lombok.Getter;
import org.springframework.security.core.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.*;

@Getter
public class CustomUserDetails implements UserDetails {
    private final User user;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(User user) {
        this.user = user;
        Set<SimpleGrantedAuthority> auths = new HashSet<>();
        user.getRoles().forEach(r -> auths.add(new SimpleGrantedAuthority("ROLE_" + r.getRoleName())));
        this.authorities = auths;
    }

    @Override public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }
    @Override public String getPassword() {
        return user.getPasswordHash();
    }

    @Override public String getUsername() {
        return user.getEmail();
    }

    @Override public boolean isAccountNonExpired() {
        return true;
    }

    @Override public boolean isAccountNonLocked() {
        return true;
    }

    @Override public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override public boolean isEnabled() {
        return true;
    }
}