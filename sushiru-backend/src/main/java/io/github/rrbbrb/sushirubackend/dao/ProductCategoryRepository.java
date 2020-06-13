package io.github.rrbbrb.sushirubackend.dao;

import io.github.rrbbrb.sushirubackend.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "productCategory", path = "product-categories")
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Integer> {
}
