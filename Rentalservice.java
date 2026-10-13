package com.Carrental.car.SErvice;

import com.Carrental.car.Entity.Rental;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.UUID;

public interface Rentalservice {

    Page<Rental>findall(Pageable pageable);
     Rental CreatetheRental(UUID idcustomer, LocalDate startdate,LocalDate endDate,UUID carid);

}
