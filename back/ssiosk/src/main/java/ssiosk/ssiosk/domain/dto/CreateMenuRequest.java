package ssiosk.ssiosk.domain.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;
import ssiosk.ssiosk.domain.entity.MenuEntity;


@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
public class CreateMenuRequest {

    @NotBlank(message = "메뉴 이름을 입력해주세요")
    @Size(max = 25, message = "메뉴 이름은 최대 25자입니다.")
    @Pattern(regexp = "^[가-힣\\d\s]*$", message = "메뉴 이름은 한글만 가능합니다.")
    private String name;

    @Pattern(regexp = "^[가-힣\\d\s.,?!]*$", message = "메뉴 설명은 한글만 가능합니다.")
    private String description;

    @NotNull(message = "카테고리를 입력해주세요.")
    @Min(value = 1, message = "카테고리 ID를 1 이상 입력해주세요.")
    private Integer categoryId;

    private MultipartFile image;

    @NotNull(message = "가격을 입력해주세요.")
    @Min(value = 0, message = "가격을 0원 이상 입력해주세요.")
    @Max(value = 1000000000, message = "너무 높은 가격은 불가능합니다.")
    private Integer price;

    public static MenuEntity toEntity(CreateMenuRequest request) {
        return MenuEntity
                .builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .build();
    }
}

