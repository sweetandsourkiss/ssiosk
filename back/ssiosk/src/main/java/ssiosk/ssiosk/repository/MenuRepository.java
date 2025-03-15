package ssiosk.ssiosk.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ssiosk.ssiosk.domain.entity.MenuEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuRepository extends JpaRepository<MenuEntity, Integer> {

    @Query(value = "SELECT m FROM MenuEntity m WHERE m.name = :name")
    public Optional<MenuEntity> findByName(String name);

    @Query(value = "SELECT m FROM MenuEntity m WHERE m.name = :name AND m.id != :menuId AND m.isDeleted = FALSE")
    public Optional<MenuEntity> findByNameAndIdAndIsDeletedIsFalse(String name, Integer menuId);

    @Query(value = "SELECT m FROM MenuEntity m WHERE m.isDeleted = FALSE")
    public List<MenuEntity> findAll();

    @Query(value = "SELECT m FROM MenuEntity m WHERE m.id = :menuId AND m.isDeleted = FALSE")
    public Optional<MenuEntity> findByIdAndIsDeletedIsFalse(Integer menuId);

    @Query(value = "SELECT m FROM MenuEntity m WHERE m.categoryEntity.id = :categoryId AND m.isDeleted = FALSE")
    public List<MenuEntity> findAllByCategoryId(Integer categoryId);
}
