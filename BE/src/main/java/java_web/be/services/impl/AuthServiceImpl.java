package java_web.be.services.impl;

import java_web.be.dtos.request.LoginRequest;
import java_web.be.dtos.request.RegisterRequest;
import java_web.be.dtos.response.AuthResponse;
import java_web.be.model.Role;
import java_web.be.model.Token;
import java_web.be.model.User;
import java_web.be.repositories.RoleRepository;
import java_web.be.repositories.TokenRepository;
import java_web.be.repositories.UserRepository;
import java_web.be.security.JwtTokenProvider;
import java_web.be.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final TokenRepository tokenRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtProvider;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Role role = roleRepo.findByRoleName("CUSTOMER")
                .orElseThrow(() -> new RuntimeException("Default role not found"));

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .avatarUrl(request.getAvatarUrl())
                .build();

        user.getRoles().add(role);
        user = userRepo.save(user);

        String roleName = role.getRoleName();
        // generate tokens using email + role
        String accessToken = jwtProvider.generateAccessToken(user.getEmail(), roleName);
        String refreshToken = jwtProvider.generateRefreshToken(user.getEmail());

        Token t = Token.builder()
                .tokenValue(refreshToken)
                .user(user)
                .createdAt(LocalDateTime.now())
                .build();
        tokenRepo.save(t);

        return new AuthResponse(accessToken, refreshToken, roleName);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Revoke previous tokens for this user
        revokeAllUserTokens(user);

        String roleName = user.getRoles().stream().findFirst().map(Role::getRoleName).orElse("CUSTOMER");
        String accessToken = jwtProvider.generateAccessToken(user.getEmail(), roleName);
        String refreshToken = jwtProvider.generateRefreshToken(user.getEmail());

        Token t = Token.builder()
                .tokenValue(refreshToken)
                .user(user)
                .createdAt(LocalDateTime.now())
                .build();
        tokenRepo.save(t);

        return new AuthResponse(accessToken, refreshToken, roleName);
    }

    @Override
    @Transactional
    public AuthResponse refresh(String refreshToken) {
        Token token = tokenRepo.findByTokenValue(refreshToken)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (token.isExpired() || token.isRevoked()) {
            throw new RuntimeException("Refresh token revoked or expired");
        }

        if (!jwtProvider.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        User user = token.getUser();
        String roleName = user.getRoles().stream().findFirst().map(Role::getRoleName).orElse("CUSTOMER");
        String newAccess = jwtProvider.generateAccessToken(user.getEmail(), roleName);

        // keep same refresh token in this implementation (no rotate)
        return new AuthResponse(newAccess, refreshToken, roleName);
    }

    @Override
    @Transactional
    public void logout(String refreshTokenOrEmail) {
        // support either refreshToken or email for logout
        tokenRepo.findByTokenValue(refreshTokenOrEmail).ifPresent(t -> {
            t.setExpired(true);
            t.setRevoked(true);
            t.setRevokedAt(LocalDateTime.now());
            tokenRepo.save(t);
        });

        userRepo.findByEmail(refreshTokenOrEmail).ifPresent(user -> {
            revokeAllUserTokens(user);
        });
    }

    private void revokeAllUserTokens(User user) {
        List<Token> tokens = tokenRepo.findByUser(user);
        tokens.forEach(t -> {
            t.setExpired(true);
            t.setRevoked(true);
            t.setRevokedAt(LocalDateTime.now());
        });
        tokenRepo.saveAll(tokens);
    }
}
