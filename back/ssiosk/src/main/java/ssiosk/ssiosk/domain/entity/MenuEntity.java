package ssiosk.ssiosk.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.SQLDelete;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "menus")
@Getter
@NoArgsConstructor
@DynamicInsert
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE menus SET is_deleted = TRUE where menu_id = ?")
public class MenuEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "menu_id")
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    @Column(nullable = false)
    private Integer price;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private CategoryEntity categoryEntity;

    @Column(name = "image_url")
    private String imageUrl;

    @CreatedDate
    @Column(nullable = false, name = "created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false, name = "modified_at")
    private LocalDateTime modifiedAt;

    @Column(nullable = false, name = "is_deleted")
    private Boolean isDeleted;

    @Builder
    public MenuEntity(Integer id, String name, String description, Integer price, CategoryEntity categoryEntity, String imageUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.categoryEntity = categoryEntity;
        this.imageUrl = imageUrl;
    }

    public void updateAll(MenuEntity menuEntity) {
        this.name = menuEntity.getName();
        this.description = menuEntity.getDescription();
        this.price = menuEntity.price;
    }

    public void updateCategory(CategoryEntity categoryEntity) {
        this.categoryEntity = categoryEntity;
    }

    public void updateImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void changeIsDeleted() { this.isDeleted = !isDeleted;}

}

