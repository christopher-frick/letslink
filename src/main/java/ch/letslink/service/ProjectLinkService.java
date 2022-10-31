package ch.letslink.service;

import ch.letslink.domain.ProjectLink;
import ch.letslink.repository.ProjectLinkRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ProjectLink}.
 */
@Service
@Transactional
public class ProjectLinkService {

    private final Logger log = LoggerFactory.getLogger(ProjectLinkService.class);

    private final ProjectLinkRepository projectLinkRepository;

    public ProjectLinkService(ProjectLinkRepository projectLinkRepository) {
        this.projectLinkRepository = projectLinkRepository;
    }

    /**
     * Save a projectLink.
     *
     * @param projectLink the entity to save.
     * @return the persisted entity.
     */
    public ProjectLink save(ProjectLink projectLink) {
        log.debug("Request to save ProjectLink : {}", projectLink);
        return projectLinkRepository.save(projectLink);
    }

    /**
     * Update a projectLink.
     *
     * @param projectLink the entity to save.
     * @return the persisted entity.
     */
    public ProjectLink update(ProjectLink projectLink) {
        log.debug("Request to update ProjectLink : {}", projectLink);
        return projectLinkRepository.save(projectLink);
    }

    /**
     * Partially update a projectLink.
     *
     * @param projectLink the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ProjectLink> partialUpdate(ProjectLink projectLink) {
        log.debug("Request to partially update ProjectLink : {}", projectLink);

        return projectLinkRepository
            .findById(projectLink.getId())
            .map(existingProjectLink -> {
                if (projectLink.getName() != null) {
                    existingProjectLink.setName(projectLink.getName());
                }
                if (projectLink.getUrl() != null) {
                    existingProjectLink.setUrl(projectLink.getUrl());
                }

                return existingProjectLink;
            })
            .map(projectLinkRepository::save);
    }

    /**
     * Get all the projectLinks.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ProjectLink> findAll() {
        log.debug("Request to get all ProjectLinks");
        return projectLinkRepository.findAll();
    }

    /**
     * Get one projectLink by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ProjectLink> findOne(Long id) {
        log.debug("Request to get ProjectLink : {}", id);
        return projectLinkRepository.findById(id);
    }

    /**
     * Delete the projectLink by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete ProjectLink : {}", id);
        projectLinkRepository.deleteById(id);
    }
}
