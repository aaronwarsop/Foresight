package com.foresight.backend.repository;

import com.foresight.backend.model.Account;
import com.foresight.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByUser(User user);

    Optional<Account> findByUserId(Long userId);
}
