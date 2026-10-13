package com.Carrental.car.config;

import com.Carrental.car.Entity.Car;
import com.Carrental.car.Entity.User;
import com.Carrental.car.Enum.CarStatues;
import com.Carrental.car.Enum.Role;
import com.Carrental.car.Repositry.CarRepositry;
import com.Carrental.car.Repositry.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Demo data so the website is not empty on first run.
 * Disable with app.seed.enabled=false.
 */
@Slf4j
@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CarRepositry carRepositry;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.enabled:false}")
    private boolean enabled;

    @Value("${app.seed.admin-email:admin@carrental.com}")
    private String adminEmail;

    @Value("${app.seed.admin-password:Admin@12345}")
    private String adminPassword;

    public DataSeeder(UserRepository userRepository, CarRepositry carRepositry, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.carRepositry = carRepositry;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!enabled) {
            return;
        }

        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .fullName("Admin")
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            log.info("Seeded admin account: {}", adminEmail);
        }

        if (carRepositry.count() == 0) {
            carRepositry.saveAll(List.of(
                    car("Fiat", "Tipo", 2023, "أ ب ج ١٢٣٤", 1200, CarStatues.Avalaible),
                    car("Nissan", "Sunny", 2021, "س ص ع ٤٨٢١", 1000, CarStatues.Avalaible),
                    car("Chevrolet", "Optra", 2020, "ك ل م ٩٠٦٣", 900, CarStatues.Rented),
                    car("Hyundai", "Elantra", 2024, "ن هـ و ٣٣٠٧", 1500, CarStatues.Avalaible),
                    car("Toyota", "Corolla", 2023, "ر ز ط ٧٧١٥", 1600, CarStatues.Avalaible),
                    car("Skoda", "Octavia", 2024, "د ذ ر ٢٥٤٠", 1700, CarStatues.Avalaible),
                    car("MG", "ZS", 2023, "ف ق ك ٥٥١٢", 1600, CarStatues.Maintence),
                    car("Kia", "Sportage", 2022, "ح خ د ٨٠٩٤", 2000, CarStatues.Avalaible),
                    car("Mercedes", "C200", 2023, "ج ح خ ٦٦٢٨", 3500, CarStatues.Avalaible),
                    car("BMW", "320i", 2022, "ب ت ث ١٩٧٣", 3800, CarStatues.Rented)
            ));
            log.info("Seeded sample cars");
        }
    }

    private Car car(String brand, String model, int year, String plate, long pricePerDay, CarStatues status) {
        Car c = new Car();
        c.setPrand(brand);
        c.setModel(model);
        c.setYear(year);
        c.setPlatenumber(plate);
        c.setPriceinday(pricePerDay);
        c.setCarStatues(status);
        return c;
    }
}
