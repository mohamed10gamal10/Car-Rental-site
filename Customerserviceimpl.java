package com.Carrental.car.impl;

import com.Carrental.car.Entity.Customer;
import com.Carrental.car.Exaption.ErrorREsponseExaption;
import com.Carrental.car.Repositry.Customerrepositry;
import com.Carrental.car.SErvice.CustomerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class Customerserviceimpl implements CustomerService {

    private final Customerrepositry customerrepositry;

    public Customerserviceimpl(Customerrepositry customerrepositry) {
        this.customerrepositry = customerrepositry;
    }

    @Override
    public Page<Customer> getall(Pageable pageable) {
        return customerrepositry.findAll(pageable);
    }

    @Override
    public Customer findCustomerbyid(UUID id) {
        return customerrepositry.findById(id)
                .orElseThrow(() -> new ErrorREsponseExaption("Customer not found"));
    }

    @Override
    public Customer addnewCusomer(Customer customer) {
        return customerrepositry.save(customer);
    }

    @Override
    public void deletbyid(UUID id) {
        customerrepositry.deleteById(id);
    }

    @Override
    public void deleteall() {
        customerrepositry.deleteAll();
    }
}
