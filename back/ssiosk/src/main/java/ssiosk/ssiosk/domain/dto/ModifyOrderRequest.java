package ssiosk.ssiosk.domain.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ModifyOrderRequest {

    @NotNull(message = "수량을 입력해주세요.")
    @Min(value = 1, message = "수량을 1개 이상 입력해주세요.")
    private Integer quantity;

}
