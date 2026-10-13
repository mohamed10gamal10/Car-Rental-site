package com.Carrental.car.EntityDto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "الاسم الكامل مطلوب")
    @Size(min = 3, max = 100, message = "الاسم يجب أن يكون بين 3 و 100 حرف")
    private String fullName;

    @NotBlank(message = "البريد الإلكتروني مطلوب")
    @Email(message = "صيغة البريد الإلكتروني غير صحيحة")
    private String email;

    @NotBlank(message = "كلمة المرور مطلوبة")
    @Size(min = 6, message = "كلمة المرور يجب ألا تقل عن 6 أحرف")
    private String password;
}
