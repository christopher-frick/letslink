package ch.letslink.repository;

import ch.letslink.domain.ProjectLink;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ProjectLink entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProjectLinkRepository extends JpaRepository<ProjectLink, Long> {}
