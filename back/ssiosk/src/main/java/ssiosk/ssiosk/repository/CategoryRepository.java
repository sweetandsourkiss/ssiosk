package ssiosk.ssiosk.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ssiosk.ssiosk.domain.entity.CategoryEntity;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, Integer> {

    @Query(value = "SELECT c FROM CategoryEntity c WHERE c.name = :name")
    public Optional<CategoryEntity> findByName(String name);

    @Query(value = "SELECT c FROM CategoryEntity c WHERE c.name = :name AND c.isDeleted = FALSE")
    public Optional<CategoryEntity> findByNameAndIsDeletedIsFalse(String name);

    @Query(value = "SELECT c FROM CategoryEntity c WHERE c.isDeleted = FALSE")
    public List<CategoryEntity> findAll();

    @Query(value = "SELECT c FROM CategoryEntity c WHERE c.id = :categoryId AND c.isDeleted = FALSE")
    public Optional<CategoryEntity> findByIdAndIsDeletedIsFalse(Integer categoryId);
}
