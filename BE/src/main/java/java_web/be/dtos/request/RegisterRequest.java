package java_web.be.dtos.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;
    @Email
    @NotBlank
    private String email;

    @NotBlank @Size(min = 6)
    private String password;

    private String phoneNumber;

    private String avatarUrl;
}