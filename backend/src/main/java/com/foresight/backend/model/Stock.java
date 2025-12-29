package com.foresight.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "stocks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String symbol;

    @Column(nullable = false)
    private String companyName;

    @Column(precision = 10, scale = 2)
    private BigDecimal currentPrice;

    @Column(precision = 5, scale = 2)
    private BigDecimal dividendYield;

    @Column(precision = 10, scale = 2)
    private BigDecimal annualDividend;

    private LocalDateTime nextDividendDate;

    private LocalDateTime nextEarningsDate;

    @Column(nullable = false)
    private LocalDateTime lastUpdated;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }
}
