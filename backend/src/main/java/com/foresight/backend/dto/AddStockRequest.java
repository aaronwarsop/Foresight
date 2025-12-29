package com.foresight.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddStockRequest {
    private Long userId;
    private String symbol;
    private Integer quantity;
    private BigDecimal buyPrice;
}
