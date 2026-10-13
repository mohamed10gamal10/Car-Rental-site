package com.Carrental.car.SErvice;

import com.Carrental.car.Entity.User;
import com.Carrental.car.EntityDto.AuthResponse;
import com.Carrental.car.EntityDto.LoginRequest;
import com.Carrental.car.EntityDto.RegisterRequest;
import com.Carrental.car.Enum.Role;
import com.Carrental.car.Exaption.EmailAlreadyExistsException;
import com.Carrental.car.Exaption.InvalidCredentialsException;
import com.Carrental.car.Repositry.UserRepository;
import com.Carrental.car.security.JwtUtil;
import com.Carrental.car.security.TokenBlacklistService;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final TokenBlacklistService tokenBlacklistService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("هذا البريد الإلكتروني مسجل بالفعل");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .enabled(true)
                .build();

        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(saved.getId())
                .fullName(saved.getFullName())
                .email(saved.getEmail())
                .role(saved.getRole().name())
                .message("تم إنشاء الحساب بنجاح")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException ex) {
            throw new InvalidCredentialsException("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("البريد الإلكتروني أو كلمة المرور غير صحيحة"));

        String token = jwtUtil.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .message("تم تسجيل الدخول بنجاح")
                .build();
    }

    public void logout(String bearerToken) {
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            try {
                long expiration = jwtUtil.extractExpiration(token).getTime();
                tokenBlacklistService.blacklist(token, expiration);
            } catch (JwtException | IllegalArgumentException ex) {
                // invalid or already expired token: nothing to blacklist
            }
        }
    }
}
