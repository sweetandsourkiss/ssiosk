package ssiosk.ssiosk.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ssiosk.ssiosk.domain.entity.CategoryEntity;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequest {

    @NotBlank(message = "카테고리 이름을 입력해주세요.")
    @Size(max = 15, message = "카테고리 이름은 최대 15자입니다.")
    @Pattern(regexp = "^[가-힣\\d\s]*$", message = "카테고리 이름은 한글만 가능합니다.")
    private String name;

    public static CategoryEntity toEntity(CategoryRequest request) {
        return CategoryEntity
                .builder()
                .name(request.getName())
                .build();
    }

}
