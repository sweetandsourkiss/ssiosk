package ssiosk.ssiosk.domain.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ssiosk.ssiosk.domain.entity.OrderEntity;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {

    @NotNull(message = "메뉴를 입력해주세요.")
    @Min(value = 1, message = "메뉴 ID를 1 이상 입력해주세요.")
    private Integer menuId;

    @NotNull(message = "수량을 입력해주세요.")
    @Min(value = 1, message = "수량을 1개 이상 입력해주세요.")
    @Max(value = 1000000, message = "너무 많은 수량은 불가능합니다.")
    private Integer quantity;

    public static OrderRequest toDTO(OrderEntity orderEntity) {
        OrderRequest request = new OrderRequest(orderEntity.getMenuEntity().getId(), orderEntity.getQuantity());
        return request;
    }

    public static OrderEntity toEntity(OrderRequest request) {
        return new OrderEntity(request.getQuantity());
    }
}