package com.foresight.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse {
    private BigDecimal currentValue;
    private BigDecimal totalDeposits;
    private BigDecimal totalProfitLoss;
    private BigDecimal totalProfitLossPercentage;
    private BigDecimal dailyProfitLoss;
    private BigDecimal dailyProfitLossPercentage;
}
