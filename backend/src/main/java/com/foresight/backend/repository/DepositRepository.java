package com.foresight.backend.repository;

import com.foresight.backend.model.Deposit;
import com.foresight.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DepositRepository extends JpaRepository<Deposit, Long> {

    List<Deposit> findByUser(User user);

    List<Deposit> findByUserIdOrderByDepositDateDesc(Long userId);

    @Query("SELECT SUM(d.amount) FROM Deposit d WHERE d.user.id = :userId")
    Double getTotalDepositsByUserId(Long userId);
}
