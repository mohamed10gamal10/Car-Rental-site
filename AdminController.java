package com.Carrental.car.controll;

import com.Carrental.car.EntityDto.ApiMessageResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// All /api/admin/** routes require ROLE_ADMIN — enforced in SecurityConfig.
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/dashboard")
    public ApiMessageResponse dashboard() {
        return ApiMessageResponse.builder()
                .message("مرحبا بك في لوحة تحكم المدير")
                .build();
    }
}
