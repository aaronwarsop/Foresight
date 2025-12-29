package com.foresight.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepositRequest {
    private Long userId;
    private BigDecimal amount;
    private String description;
}
