package ssiosk.ssiosk.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ssiosk.ssiosk.domain.dto.CreateMenuRequest;
import ssiosk.ssiosk.domain.dto.ModifyMenuRequest;
import ssiosk.ssiosk.domain.dto.MenuResponse;
import ssiosk.ssiosk.service.MenuService;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Validated
public class MenuRestController {

    private final MenuService menuService;

    @GetMapping("/menus")
    public ResponseEntity<?> getMenus(
            @RequestParam(required = false)
            @Min(value = 1, message = "카테고리 ID를 1 이상 입력해주세요.") Integer categoryId) {
        List<MenuResponse> categoryResponseList;

        if (categoryId != null) {
            categoryResponseList = menuService.getMenusByCategory(categoryId);
            return new ResponseEntity<>(categoryResponseList, HttpStatus.OK);
        }

        categoryResponseList = menuService.getAllMenus();
        return new ResponseEntity<>(categoryResponseList, HttpStatus.OK);
    }

    @GetMapping("/menus/{menuId}")
    public ResponseEntity<?> getMenu(
            @PathVariable
            @NotNull(message = "메뉴를 입력해주세요.")
            @Min(value = 1, message = "메뉴 ID를 1 이상 입력해주세요.") Integer menuId) {
        return new ResponseEntity<>(menuService.getMenu(menuId), HttpStatus.OK);
    }

    @PostMapping("/menus")
    public ResponseEntity<?> createMenu(@Valid CreateMenuRequest createMenuRequest) {
        return new ResponseEntity<>(menuService.addMenu(createMenuRequest), HttpStatus.CREATED);
    }

    @PutMapping("/menus/{menuId}")
    public ResponseEntity<?> modifyMenu(
            @Valid ModifyMenuRequest modifyMenuRequest,
            @PathVariable
            @NotNull(message = "메뉴를 입력해주세요.")
            @Min(value = 1, message = "메뉴 ID를 1 이상 입력해주세요.") Integer menuId) {
        return new ResponseEntity<>(menuService.modifyMenu(menuId, modifyMenuRequest), HttpStatus.OK);
    }

    @DeleteMapping("/menus/{menuId}")
    public ResponseEntity<?> deleteMenu(
            @PathVariable
            @NotNull(message = "메뉴를 입력해주세요.")
            @Min(value = 1, message = "메뉴 ID를 1 이상 입력해주세요.") Integer menuId) {
        menuService.deleteMenu(menuId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/menus/categories/{categoryId}")
    public ResponseEntity<?> getMenusByCategoryId(
            @PathVariable
            @NotNull(message = "메뉴를 입력해주세요.")
            @Min(value = 1, message = "메뉴 ID를 1 이상 입력해주세요.") Integer categoryId) {
        return new ResponseEntity<>(menuService.getMenusByCategory(categoryId), HttpStatus.OK);
    }

}
