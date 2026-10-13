package com.Carrental.car.controll;

import com.Carrental.car.Entity.Car;
import com.Carrental.car.SErvice.CarService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/car")
public class Carcontroler {

    // depend on the interface, not on the concrete implementation
    private final CarService carService;

    public Carcontroler(CarService carService) {
        this.carService = carService;
    }

    @GetMapping("/allcar")
    public Page<Car> getallcar(Pageable pageable) {
        return carService.getall(pageable);
    }

    // ADMIN only (see SecurityConfig: /api/car/admin/**)
    @PostMapping("/admin/addcar")
    public ResponseEntity<Car> addnewCar(@RequestBody Car car) {
        return ResponseEntity.status(HttpStatus.CREATED).body(carService.addnewcar(car));
    }

    @GetMapping("/id/{id}")
    public Car findbyid(@PathVariable UUID id) {
        return carService.findCarbyid(id);
    }
}
