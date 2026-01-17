package com.foresight.backend.repository;

import com.foresight.backend.model.PortfolioHolding;
import com.foresight.backend.model.User;
import com.foresight.backend.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PortfolioHoldingRepository extends JpaRepository<PortfolioHolding, Long> {

    List<PortfolioHolding> findByUser(User user);

    List<PortfolioHolding> findByUserId(Long userId);

    Optional<PortfolioHolding> findByUserAndStock(User user, Stock stock);

    @Query("SELECT SUM(ph.totalInvested) FROM PortfolioHolding ph WHERE ph.user.id = :userId")
    Double getTotalInvestedByUserId(Long userId);

    @Query("SELECT SUM(ph.currentValue) FROM PortfolioHolding ph WHERE ph.user.id = :userId")
    Double getTotalCurrentValueByUserId(Long userId);

    @Query("SELECT COUNT(ph) FROM PortfolioHolding ph WHERE ph.stock.id = :stockId")
    Long countByStockId(Long stockId);
}
