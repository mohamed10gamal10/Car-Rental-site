package com.Carrental.car.Repositry;

import com.Carrental.car.Entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
@Repository
public interface MaintenanceRepositry extends JpaRepository<Maintenance, UUID> {


}
