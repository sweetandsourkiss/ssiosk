package ssiosk.ssiosk.domain.dto;


import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import lombok.Builder;
import lombok.Getter;
import ssiosk.ssiosk.domain.entity.OrderEntity;

import java.time.LocalDateTime;
@Getter
public class OrderResponse {
    private Integer id;
    private Integer menuId;
    private Integer quantity;
    private Integer tableNumber;

    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime orderedAt;

    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime completedAt;
    @Builder
    public OrderResponse(
             Integer id,
             Integer menuId,
             Integer quantity,
             Integer tableNumber,
             LocalDateTime orderedAt,
             LocalDateTime completedAt) {
        this.id = id;
        this.menuId = menuId;
        this.quantity = quantity;
        this.tableNumber = tableNumber;
        this.orderedAt = orderedAt;
        this.completedAt = completedAt;
    }

    public static OrderResponse toDTO(OrderEntity orderEntity) {
        return OrderResponse
                .builder()
                .id(orderEntity.getId())
                .menuId(orderEntity.getMenuEntity().getId())
                .quantity(orderEntity.getQuantity())
                .tableNumber(orderEntity.getTableNumber())
//                .orderedAt(ZonedDateTime.of(orderEntity.getOrderedAt(), ZoneId.of("UTC")))
//                .completedAt(orderEntity.getCompletedAt() != null ? ZonedDateTime.of(orderEntity.getCompletedAt(), ZoneId.of("UTC")) : null)
                .orderedAt(orderEntity.getOrderedAt())
                .completedAt(orderEntity.getCompletedAt())
                .build();
    }

}
