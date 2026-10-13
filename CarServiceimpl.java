package com.Carrental.car.impl;

import com.Carrental.car.Entity.Car;
import com.Carrental.car.Exaption.ErrorREsponseExaption;
import com.Carrental.car.Repositry.CarRepositry;
import com.Carrental.car.SErvice.CarService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CarServiceimpl implements CarService {

    private final CarRepositry carRepositry;

    public CarServiceimpl(CarRepositry carRepositry) {
        this.carRepositry = carRepositry;
    }

    @Override
    public Page<Car> getall(Pageable pageable) {
        return carRepositry.findAll(pageable);
    }

    @Override
    public Car findCarbyid(UUID id) {
        return carRepositry.findById(id)
                .orElseThrow(() -> new ErrorREsponseExaption("This car not found"));
    }

    @Override
    public List<Car> findbymodelandprand(String model, String prand) {
        return carRepositry.findByModelAndPrand(model, prand);
    }

    @Override
    public Page<Car> findbyyear(int year, Pageable pageable) {
        return carRepositry.findByYear(year, pageable);
    }

    @Override
    public Page<Car> findbypriceinday(Long price, Pageable pageable) {
        return carRepositry.findByPriceinday(price, pageable);
    }

    @Override
    public Car addnewcar(Car car) {
        return carRepositry.save(car);
    }

    @Override
    public void deletbyid(UUID id) {
        carRepositry.deleteById(id);
    }

    @Override
    public void deleteall() {
        carRepositry.deleteAll();
    }
}
