package com.Carrental.car.controll;

import com.Carrental.car.Entity.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    // Protected endpoint: requires a valid, non-blacklisted JWT (see SecurityConfig).
    @GetMapping("/me")
    public Map<String, Object> me(@AuthenticationPrincipal User user) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("id", user.getId());
        body.put("fullName", user.getFullName());
        body.put("email", user.getEmail());
        body.put("role", user.getRole().name());
        return body;
    }
}
