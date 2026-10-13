package com.Carrental.car.controll;

import com.Carrental.car.EntityDto.ApiMessageResponse;
import com.Carrental.car.SErvice.AcountService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/Payment")
public class AcountControl {

    private final AcountService acountService;

    public AcountControl(AcountService acountService) {
        this.acountService = acountService;
    }

    // POST (not GET): a request that changes balances must never be a GET
    @PostMapping("/amount/{fromid}/{toid}/{amount}")
    public ApiMessageResponse transferPayment(@PathVariable UUID fromid,
                                              @PathVariable UUID toid,
                                              @PathVariable Double amount) {
        acountService.transfer(fromid, toid, amount);
        return ApiMessageResponse.builder().message("Transfer completed").build();
    }
}
