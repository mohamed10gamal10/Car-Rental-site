package com.Carrental.car.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.ToString;

import java.util.UUID;

@Entity
@Table(name = "Acount_User")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Acount {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    @NonNull
    private UUID Fromid;

    @Column(nullable = false)
    @NonNull
    private UUID ToId;

    @Column(nullable = false)
    @NonNull
    private Double amount;

    @Column(nullable = false)
    @NonNull
    private Double blance;

    @OneToOne(fetch = FetchType.LAZY)
    @ToString.Exclude
    private Customer customer;
}
