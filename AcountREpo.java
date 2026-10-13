package com.Carrental.car.Repositry;

import com.Carrental.car.Entity.Acount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AcountREpo extends JpaRepository<Acount,UUID> {

}
