package ch.letslink.repository;

import ch.letslink.domain.SellerProfile;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SellerProfile entity.
 */
@Repository
public interface SellerProfileRepository extends JpaRepository<SellerProfile, Long> {
    default Optional<SellerProfile> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<SellerProfile> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<SellerProfile> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct sellerProfile from SellerProfile sellerProfile left join fetch sellerProfile.user",
        countQuery = "select count(distinct sellerProfile) from SellerProfile sellerProfile"
    )
    Page<SellerProfile> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct sellerProfile from SellerProfile sellerProfile left join fetch sellerProfile.user")
    List<SellerProfile> findAllWithToOneRelationships();

    @Query("select sellerProfile from SellerProfile sellerProfile left join fetch sellerProfile.user where sellerProfile.id =:id")
    Optional<SellerProfile> findOneWithToOneRelationships(@Param("id") Long id);
}
