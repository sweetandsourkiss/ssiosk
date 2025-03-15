package ssiosk.ssiosk.service;

import lombok.NonNull;
import org.springframework.stereotype.Service;
import ssiosk.ssiosk.domain.dto.CreateMenuRequest;
import ssiosk.ssiosk.domain.dto.ModifyMenuRequest;
import ssiosk.ssiosk.domain.dto.MenuResponse;

import java.util.List;

@Service
public interface MenuService {

    public MenuResponse addMenu(CreateMenuRequest menuRequest);

    public List<MenuResponse> getAllMenus();

    public MenuResponse getMenu(Integer menuId);

    public MenuResponse modifyMenu(Integer menuId, ModifyMenuRequest modifyMenuRequest);

    public void deleteMenu(@NonNull Integer menuId);

    public List<MenuResponse> getMenusByCategory(Integer categoryId);
}
