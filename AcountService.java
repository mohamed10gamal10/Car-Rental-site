package com.Carrental.car.SErvice;

import java.util.UUID;

public interface AcountService {

    void transfer(UUID fromid, UUID toid, Double amount);
}
