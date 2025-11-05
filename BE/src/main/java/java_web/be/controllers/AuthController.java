package java_web.be.controllers;

import jakarta.validation.Valid;
import java_web.be.dtos.request.LoginRequest;
import java_web.be.dtos.request.RegisterRequest;
import java_web.be.dtos.response.ApiResponse;
import java_web.be.dtos.response.AuthResponse;
import java_web.be.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/v1")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest req) {
        AuthResponse res = authService.register(req);
        return ResponseEntity.ok(new ApiResponse<>(true, res, "Registered"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest req) {
        AuthResponse res = authService.login(req);
        return ResponseEntity.ok(new ApiResponse<>(true, res, "Logged in"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@RequestParam("token") String refreshToken) {
        AuthResponse res = authService.refresh(refreshToken);
        return ResponseEntity.ok(new ApiResponse<>(true, res, "Token refreshed"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestParam("tokenOrEmail") String tokenOrEmail) {
        authService.logout(tokenOrEmail);
        return ResponseEntity.ok(new ApiResponse<>(true, null, "Logged out"));
    }
}
