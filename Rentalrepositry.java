package com.Carrental.car.Repositry;

import com.Carrental.car.Entity.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface Rentalrepositry extends JpaRepository<Rental, UUID> {

    @Query("""
            SELECT r FROM Rental r
            WHERE r.car.id = :id
              AND r.statue IN :statues
              AND r.start_date < :endDate
              AND r.end_date > :startDate
            """)
    List<Rental> findConflictingRentals(
            @Param("id") UUID id,
            @Param("statues") List<String> statues,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
