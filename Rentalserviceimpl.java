package com.Carrental.car.impl;

import com.Carrental.car.Entity.Car;
import com.Carrental.car.Entity.Customer;
import com.Carrental.car.Entity.Rental;
import com.Carrental.car.Enum.CarStatues;
import com.Carrental.car.Exaption.ErrorREsponseExaption;
import com.Carrental.car.Repositry.CarRepositry;
import com.Carrental.car.Repositry.Customerrepositry;
import com.Carrental.car.Repositry.Rentalrepositry;
import com.Carrental.car.SErvice.Rentalservice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class Rentalserviceimpl implements Rentalservice {

    private final Rentalrepositry rentalrepositry;
    private final CarRepositry carRepositry;
    private final Customerrepositry customerrepositry;

    public Rentalserviceimpl(Rentalrepositry rentalrepositry, CarRepositry carRepositry, Customerrepositry customerrepositry) {
        this.rentalrepositry = rentalrepositry;
        this.carRepositry = carRepositry;
        this.customerrepositry = customerrepositry;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Rental> findall(Pageable pageable) {
        return rentalrepositry.findAll(pageable);
    }

    @Override
    public Rental CreatetheRental(UUID idcustomer, LocalDate startdate, LocalDate endDate, UUID carid) {
        // the start date must be BEFORE the end date (the old check was inverted)
        if (!startdate.isBefore(endDate)) {
            throw new IllegalArgumentException("Start date must be before end date");
        }

        Customer customer = customerrepositry.findById(idcustomer)
                .orElseThrow(() -> new ErrorREsponseExaption("Customer not found"));
        Car car = carRepositry.findById(carid)
                .orElseThrow(() -> new ErrorREsponseExaption("Car not found"));

        if (car.getCarStatues() == CarStatues.Maintence) {
            throw new IllegalArgumentException("The car is in maintenance");
        }

        // Rental.statue is a String, so compare against the status names
        List<String> activeStatuses = List.of(CarStatues.Rented.name());
        List<Rental> conflicts = rentalrepositry.findConflictingRentals(carid, activeStatuses, startdate, endDate);
        if (!conflicts.isEmpty()) {
            throw new IllegalArgumentException("The car is already rented in this period");
        }

        long days = ChronoUnit.DAYS.between(startdate, endDate);
        BigDecimal totalPrice = BigDecimal.valueOf(car.getPriceinday())
                .multiply(BigDecimal.valueOf(days));

        Rental rental = new Rental();
        rental.setCustomer(customer);
        rental.setCar(car);
        rental.setStatue(CarStatues.Rented.name());
        rental.setStart_date(startdate);
        rental.setEnd_date(endDate);
        rental.setTotal_price(totalPrice);
        return rentalrepositry.save(rental);
    }
}
