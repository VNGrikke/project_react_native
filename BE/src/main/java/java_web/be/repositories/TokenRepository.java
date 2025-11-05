package java_web.be.repositories;

import java_web.be.model.Token;
import java_web.be.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {
    Optional<Token> findByTokenValue(String tokenValue);
    List<Token> findByUser(User user);
    void deleteByUser(User user);
}