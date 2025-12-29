package com.foresight.backend.service;

import com.foresight.backend.dto.AccountResponse;
import com.foresight.backend.model.Account;
import com.foresight.backend.model.Deposit;
import com.foresight.backend.model.User;
import com.foresight.backend.repository.AccountRepository;
import com.foresight.backend.repository.DepositRepository;
import com.foresight.backend.repository.PortfolioHoldingRepository;
import com.foresight.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepositRepository depositRepository;

    @Autowired
    private PortfolioHoldingRepository portfolioHoldingRepository;

    public AccountResponse getAccountInfo(Long userId) {
        Account account = accountRepository.findByUserId(userId)
                .orElseGet(() -> createAccountForUser(userId));

        // Calculate current portfolio value
        Double currentValueDouble = portfolioHoldingRepository.getTotalCurrentValueByUserId(userId);
        BigDecimal currentValue = currentValueDouble != null
                ? BigDecimal.valueOf(currentValueDouble)
                : BigDecimal.ZERO;

        // Calculate total deposits
        Double totalDepositsDouble = depositRepository.getTotalDepositsByUserId(userId);
        BigDecimal totalDeposits = totalDepositsDouble != null
                ? BigDecimal.valueOf(totalDepositsDouble)
                : BigDecimal.ZERO;

        // Calculate P&L
        BigDecimal totalProfitLoss = currentValue.subtract(totalDeposits);
        BigDecimal totalProfitLossPercentage = totalDeposits.compareTo(BigDecimal.ZERO) > 0
                ? totalProfitLoss.divide(totalDeposits, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100))
                : BigDecimal.ZERO;

        // Update account entity
        account.setCurrentValue(currentValue);
        account.setTotalDeposits(totalDeposits);
        account.setTotalProfitLoss(totalProfitLoss);
        accountRepository.save(account);

        return new AccountResponse(
                currentValue,
                totalDeposits,
                totalProfitLoss,
                totalProfitLossPercentage,
                account.getDailyProfitLoss(),
                BigDecimal.ZERO // Daily P&L percentage - can be calculated if needed
        );
    }

    @Transactional
    public Deposit addDeposit(Long userId, BigDecimal amount, String description) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Deposit deposit = new Deposit();
        deposit.setUser(user);
        deposit.setAmount(amount);
        deposit.setDescription(description);
        deposit.setDepositDate(LocalDateTime.now());

        return depositRepository.save(deposit);
    }

    public List<Deposit> getUserDeposits(Long userId) {
        return depositRepository.findByUserIdOrderByDepositDateDesc(userId);
    }

    private Account createAccountForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = new Account();
        account.setUser(user);
        account.setTotalDeposits(BigDecimal.ZERO);
        account.setCurrentValue(BigDecimal.ZERO);
        account.setTotalProfitLoss(BigDecimal.ZERO);
        account.setDailyProfitLoss(BigDecimal.ZERO);
        account.setLastUpdated(LocalDateTime.now());

        return accountRepository.save(account);
    }
}
