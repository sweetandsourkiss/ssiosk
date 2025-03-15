package ssiosk.ssiosk.domain.entity;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "categories")
@Getter
@NoArgsConstructor
@SQLDelete(sql = "UPDATE categories SET is_deleted = TRUE where category_id = ?")
@DynamicInsert
@EntityListeners(AuditingEntityListener.class)
public class CategoryEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer id;

    private String name;

    @CreatedDate
    @Column(nullable = false, name = "created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false, name = "modified_at")
    private LocalDateTime modifiedAt;

    @Column(nullable = false, name = "is_deleted")
    @ColumnDefault("false")
    private Boolean isDeleted;

    @OneToMany(mappedBy = "categoryEntity")
    private Set<MenuEntity> menuEntities = new HashSet<>();

    @Builder
    public CategoryEntity(String name) {
        this.name = name;
    }

    public void updateName(String name) {
        this.name = name;
    }

    public void changeIsDeleted() { this.isDeleted = !isDeleted;}
}
