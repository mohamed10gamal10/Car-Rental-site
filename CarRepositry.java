package com.Carrental.car.Repositry;

import com.Carrental.car.Entity.Car;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CarRepositry extends JpaRepository<Car, UUID> {

    List<Car> findByModelAndPrand(String model, String prand);

    Page<Car> findByYear(int year, Pageable pageable);

    Page<Car> findByPriceinday(Long priceinday, Pageable pageable);
}
