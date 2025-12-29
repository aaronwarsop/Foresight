package com.foresight.backend.dto;

import com.foresight.backend.model.PortfolioHolding;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioResponse {
    private List<PortfolioHolding> holdings;
    private BigDecimal totalInvested;
    private BigDecimal totalCurrentValue;
    private BigDecimal totalProfitLoss;
    private BigDecimal totalProfitLossPercentage;
    private BigDecimal averageDividendYield;
}
