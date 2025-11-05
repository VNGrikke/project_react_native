package java_web.be.dtos.response;

import lombok.*;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String role;
}
