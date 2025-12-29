package com.foresight.backend.repository;

import com.foresight.backend.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {

    Optional<Stock> findBySymbol(String symbol);

    List<Stock> findBySymbolIn(List<String> symbols);

    boolean existsBySymbol(String symbol);
}
