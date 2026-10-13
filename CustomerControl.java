package com.Carrental.car.controll;

import com.Carrental.car.Entity.Customer;
import com.Carrental.car.SErvice.CustomerService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/Customer")
public class CustomerControl {

    private final CustomerService customerService;

    public CustomerControl(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping("/addCustomer")
    public Customer addcustomer(@Valid @RequestBody Customer customer) {
        return customerService.addnewCusomer(customer);
    }

    @GetMapping("/id/{id}")
    public Customer findcustomer(@PathVariable UUID id) {
        return customerService.findCustomerbyid(id);
    }
}
