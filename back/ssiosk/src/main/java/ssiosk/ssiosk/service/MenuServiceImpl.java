package ssiosk.ssiosk.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssiosk.ssiosk.domain.dto.CreateMenuRequest;
import ssiosk.ssiosk.domain.dto.MenuResponse;
import ssiosk.ssiosk.domain.dto.ModifyMenuRequest;
import ssiosk.ssiosk.domain.entity.CategoryEntity;
import ssiosk.ssiosk.domain.entity.MenuEntity;
import ssiosk.ssiosk.domain.entity.OrderEntity;
import ssiosk.ssiosk.exception.CustomException;
import ssiosk.ssiosk.exception.ErrorCode;
import ssiosk.ssiosk.repository.CategoryRepository;
import ssiosk.ssiosk.repository.MenuRepository;
import ssiosk.ssiosk.repository.OrderRepository;
import ssiosk.ssiosk.util.FileUtil;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuServiceImpl implements MenuService{

    private final MenuRepository menuRepository;
    private final CategoryRepository categoryRepository;
    private final OrderRepository orderRepository;
    private final FileUtil fileUtil;

    @Transactional
    public MenuResponse addMenu(CreateMenuRequest createMenuRequest) {

        CategoryEntity categoryEntity = categoryRepository
                .findByIdAndIsDeletedIsFalse(createMenuRequest.getCategoryId())
                .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_FOUND));

        Optional<MenuEntity> optionalMenuEntity = menuRepository
                .findByName(createMenuRequest.getName());

        MenuEntity menuEntity;

        //이름이 있는 경우
        if(optionalMenuEntity.isPresent()) {
            menuEntity = optionalMenuEntity.get();

            if(menuEntity.getIsDeleted()) {
                menuEntity.changeIsDeleted();
            } else {
                throw new CustomException(ErrorCode.DUPLICATED_MENU);
            }
            //없는 경우
        } else {
            menuEntity = CreateMenuRequest.toEntity(createMenuRequest);
        }

        if(createMenuRequest.getImage() != null) {
            String imageUrl = fileUtil.saveFile(createMenuRequest.getImage());
            menuEntity.updateImageUrl(imageUrl);
        }
        
        menuEntity.updateCategory(categoryEntity);
        menuEntity.updateAll(CreateMenuRequest.toEntity(createMenuRequest));

        menuEntity = menuRepository.save(menuEntity);
        MenuResponse menuResponse = MenuResponse.toDTO(menuEntity);
        menuResponse.updateCategoryId(categoryEntity.getId());
        return menuResponse;
    }

    @Transactional(readOnly = true)
    public List<MenuResponse> getAllMenus() {
        List<MenuEntity> menuEntityList = menuRepository.findAll();
        return menuEntityList
                .stream()
                .map(menuEntity -> {
                    MenuResponse menuResponse = MenuResponse.toDTO(menuEntity);
                    CategoryEntity categoryEntity = menuEntity.getCategoryEntity();
                    if(categoryEntity == null) {
                        menuResponse.updateCategoryId(null);
                    } else {
                        menuResponse.updateCategoryId(categoryEntity.getId());
                    }
                    return menuResponse;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MenuResponse getMenu(Integer menuId) {
        MenuEntity menuEntity = menuRepository
                .findByIdAndIsDeletedIsFalse(menuId)
                .orElseThrow(() -> new CustomException(ErrorCode.MENU_NOT_FOUND));

        MenuResponse menuResponse = MenuResponse.toDTO(menuEntity);
        CategoryEntity categoryEntity = menuEntity.getCategoryEntity();
        if(categoryEntity != null) {
            menuResponse.updateCategoryId(categoryEntity.getId());
        }
        return menuResponse;
    }

    @Transactional
    public MenuResponse modifyMenu(Integer menuId, ModifyMenuRequest modifyMenuRequest) {
        MenuEntity menuEntity = menuRepository.findByIdAndIsDeletedIsFalse(menuId)
                .orElseThrow(() -> new CustomException(ErrorCode.MENU_NOT_FOUND));

        List<OrderEntity> orderEntityList = orderRepository.findAllByMenuIdAndCompletedAtIsNull(menuId);

        if(!orderEntityList.isEmpty()) throw new CustomException(ErrorCode.USED_MENU);

        menuRepository.findByNameAndIdAndIsDeletedIsFalse(modifyMenuRequest.getName(), menuId)
                .ifPresent(menu -> {
                    throw new CustomException(ErrorCode.DUPLICATED_MENU);
                });

        CategoryEntity categoryEntity = categoryRepository
                .findByIdAndIsDeletedIsFalse(modifyMenuRequest.getCategoryId())
                .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_FOUND));

        if(modifyMenuRequest.getImage() != null) {
            fileUtil.deleteFile(menuEntity.getImageUrl());
	        String imageUrl = fileUtil.saveFile(modifyMenuRequest.getImage());
	        menuEntity.updateImageUrl(imageUrl);
        }
        
        menuEntity.updateCategory(categoryEntity);
        menuEntity.updateAll(ModifyMenuRequest.toEntity(modifyMenuRequest));

        MenuResponse menuResponse = MenuResponse.toDTO(menuEntity);
        menuResponse.updateCategoryId(categoryEntity.getId());
        return menuResponse;
    }

    @Transactional
    public void deleteMenu(Integer menuId) {
        MenuEntity menuEntity = menuRepository.findByIdAndIsDeletedIsFalse(menuId)
                .orElseThrow(() -> new CustomException(ErrorCode.MENU_NOT_FOUND));

        List<OrderEntity> orderEntityList = orderRepository.findAllByMenuIdAndCompletedAtIsNull(menuId);

        if(!orderEntityList.isEmpty()) throw new CustomException(ErrorCode.USED_MENU);

        fileUtil.deleteFile(menuEntity.getImageUrl());

        menuRepository.delete(menuEntity);
    }

    @Transactional(readOnly = true)
    public List<MenuResponse> getMenusByCategory(Integer categoryId) {
        CategoryEntity categoryEntity = categoryRepository.findByIdAndIsDeletedIsFalse(categoryId)
                .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_FOUND));

        return menuRepository.findAllByCategoryId(categoryId).stream()
                .map(menuEntity -> {
                    MenuResponse menuResponse = MenuResponse.toDTO(menuEntity);
                    menuResponse.updateCategoryId(categoryEntity.getId());
                    return menuResponse;
                })
                .collect(Collectors.toList());
    }
}
