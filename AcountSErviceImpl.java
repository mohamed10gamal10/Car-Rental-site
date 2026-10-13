package com.Carrental.car.impl;

import com.Carrental.car.Entity.Acount;
import com.Carrental.car.Exaption.ErrorREsponseExaption;
import com.Carrental.car.Repositry.AcountREpo;
import com.Carrental.car.SErvice.AcountService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AcountSErviceImpl implements AcountService {

    private final AcountREpo acountREpo;

    public AcountSErviceImpl(AcountREpo acountREpo) {
        this.acountREpo = acountREpo;
    }

    @Override
    @Transactional
    public void transfer(UUID fromid, UUID toid, Double amount) {

        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("Amount must be greater than 0");
        }
        if (fromid.equals(toid)) {
            throw new IllegalArgumentException("Cannot transfer to the same account");
        }

        Acount from = acountREpo.findById(fromid)
                .orElseThrow(() -> new ErrorREsponseExaption("From account not found"));

        Acount to = acountREpo.findById(toid)
                .orElseThrow(() -> new ErrorREsponseExaption("To account not found"));

        if (from.getBlance() < amount) {
            throw new IllegalArgumentException("Insufficient balance");
        }

        from.setBlance(from.getBlance() - amount);
        to.setBlance(to.getBlance() + amount);

        acountREpo.save(from);
        acountREpo.save(to);
    }
}
