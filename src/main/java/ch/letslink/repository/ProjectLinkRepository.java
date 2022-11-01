package ch.letslink.repository;

import ch.letslink.domain.ProjectLink;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ProjectLink entity.
 */
@Repository
public interface ProjectLinkRepository extends JpaRepository<ProjectLink, Long> {
    default Optional<ProjectLink> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ProjectLink> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ProjectLink> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct projectLink from ProjectLink projectLink left join fetch projectLink.sellerProfile",
        countQuery = "select count(distinct projectLink) from ProjectLink projectLink"
    )
    Page<ProjectLink> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct projectLink from ProjectLink projectLink left join fetch projectLink.sellerProfile")
    List<ProjectLink> findAllWithToOneRelationships();

    @Query("select projectLink from ProjectLink projectLink left join fetch projectLink.sellerProfile where projectLink.id =:id")
    Optional<ProjectLink> findOneWithToOneRelationships(@Param("id") Long id);
}
