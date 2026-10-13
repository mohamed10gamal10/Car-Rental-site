package com.Carrental.car.Repositry;

import com.Carrental.car.Entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Repository
public interface Customerrepositry extends JpaRepository<Customer, UUID> {

    List<Customer> findByName(String name);

    Customer findByPhone(String phone);

    Customer findByEmail(String email);

    // An UPDATE query must be @Modifying and return void/int (not an entity)
    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("update Customer c set c.email = :email where c.id = :id")
    int updateEmailById(@Param("email") String email, @Param("id") UUID id);
}
