package com.Carrental.car.SErvice;

import com.Carrental.car.Entity.Car;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface CarService {

    Page<Car> getall(Pageable pageable);

    Car findCarbyid(UUID id);

    List<Car> findbymodelandprand(String model, String prand);

    Page<Car> findbyyear(int year, Pageable pageable);

    Page<Car> findbypriceinday(Long price, Pageable pageable);

    Car addnewcar(Car car);

    void deletbyid(UUID id);

    void deleteall();
}
