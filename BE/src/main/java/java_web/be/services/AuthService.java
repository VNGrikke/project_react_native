package java_web.be.services;

import java_web.be.dtos.request.LoginRequest;
import java_web.be.dtos.request.RegisterRequest;
import java_web.be.dtos.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refresh(String refreshToken);
    void logout(String refreshTokenOrEmail);
}