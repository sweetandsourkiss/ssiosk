package ssiosk.ssiosk.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@DynamicInsert
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor
public class OrderEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(nullable = false, name = "menu_id")
    private MenuEntity menuEntity;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, name = "table_number")
    private Integer tableNumber;

    @CreatedDate
    @Column(nullable = false, name = "ordered_at")
    private LocalDateTime orderedAt;

    @LastModifiedDate
    @Column(nullable = false, name = "modified_at")
    private LocalDateTime modifiedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public OrderEntity(Integer quantity) {
        this.quantity = quantity;
    }

    public void updateTableNumber(Integer tableNumber) {
        this.tableNumber = tableNumber;
    }

    public void updateMenu(MenuEntity menuEntity) {
        this.menuEntity = menuEntity;
    }

    public void updateQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void updateOrderedAt(LocalDateTime orderedAt) {this.orderedAt = orderedAt.plusHours(9);}
}
