package com.foresight.backend.controller;

import com.foresight.backend.dto.AccountResponse;
import com.foresight.backend.dto.DepositRequest;
import com.foresight.backend.model.Account;
import com.foresight.backend.model.Deposit;
import com.foresight.backend.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/account")
@CrossOrigin(origins = "*")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @GetMapping("/{userId}")
    public ResponseEntity<AccountResponse> getAccountInfo(@PathVariable Long userId) {
        AccountResponse accountInfo = accountService.getAccountInfo(userId);
        return ResponseEntity.ok(accountInfo);
    }

    @PostMapping("/deposit")
    public ResponseEntity<Deposit> addDeposit(@RequestBody DepositRequest request) {
        Deposit deposit = accountService.addDeposit(
                request.getUserId(),
                request.getAmount(),
                request.getDescription()
        );
        return ResponseEntity.ok(deposit);
    }

    @GetMapping("/{userId}/deposits")
    public ResponseEntity<List<Deposit>> getDeposits(@PathVariable Long userId) {
        List<Deposit> deposits = accountService.getUserDeposits(userId);
        return ResponseEntity.ok(deposits);
    }
}
