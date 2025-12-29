package com.foresight.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockPriceUpdate {
    private String symbol;
    private BigDecimal currentPrice;
    private BigDecimal change;
    private BigDecimal changePercent;
    private LocalDateTime timestamp;
}
