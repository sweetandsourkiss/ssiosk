package ssiosk.ssiosk.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ssiosk.ssiosk.domain.entity.OrderEntity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Integer> {

    @Query("SELECT o FROM OrderEntity o WHERE o.tableNumber = :tableNumber AND o.completedAt = NULL")
    public List<OrderEntity> findAllByTableNumber(Integer tableNumber);
    @Modifying
    @Query("UPDATE OrderEntity o SET o.completedAt = CURRENT_TIMESTAMP WHERE o.tableNumber = :tableNumber AND o.completedAt = NULL")
    public Integer quitOrderByTableNumber(Integer tableNumber);

    @Query("SELECT o FROM OrderEntity o WHERE o.tableNumber = :tableNumber AND o.menuEntity.id = :menuId AND o.completedAt = NULL")
    public Optional<OrderEntity> findByTableNumberAndMenuIdAAndCompletedAtIsNull(Integer tableNumber, Integer menuId);

    public List<OrderEntity> findAllByCompletedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT o FROM OrderEntity o WHERE o.menuEntity.id = :menuId AND o.completedAt = NULL")
    public List<OrderEntity> findAllByMenuIdAndCompletedAtIsNull(Integer menuId);
}
