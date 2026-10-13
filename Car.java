package com.Carrental.car.Entity;

import com.Carrental.car.Enum.CarStatues;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Set;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Car")
public class Car {

    @Id
    @GeneratedValue
    @Column(name = "ID")
    private UUID id;

    @Column(name = "prand", nullable = false)
    private String prand;

    @Column(name = "model", nullable = false)
    private String model;

    @Column(name = "year", nullable = false)
    private int year;

    @Column(name = "plate_number", nullable = false, unique = true)
    private String platenumber;

    @Column(name = "price_in_day")
    private long priceinday;

    @Column(name = "price_in_hour")
    private long priceinhour;

    @PrePersist
    @PreUpdate
    public void calculetepriceinhour() {
        priceinhour = priceinday / 24;
    }

    @Enumerated(EnumType.STRING)
    private CarStatues carStatues;

    // JsonIgnore + Exclude: prevents infinite recursion (Car -> Rental -> Car ...) in JSON / toString / hashCode
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "car")
    private Set<Rental> rental;

    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "carMaintenance")
    private Set<Maintenance> maintenance;
}
