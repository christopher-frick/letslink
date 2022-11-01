package ch.letslink.web.rest;

import ch.letslink.domain.ProjectLink;
import ch.letslink.repository.ProjectLinkRepository;
import ch.letslink.service.ProjectLinkService;
import ch.letslink.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link ch.letslink.domain.ProjectLink}.
 */
@RestController
@RequestMapping("/api")
public class ProjectLinkResource {

    private final Logger log = LoggerFactory.getLogger(ProjectLinkResource.class);

    private static final String ENTITY_NAME = "projectLink";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProjectLinkService projectLinkService;

    private final ProjectLinkRepository projectLinkRepository;

    public ProjectLinkResource(ProjectLinkService projectLinkService, ProjectLinkRepository projectLinkRepository) {
        this.projectLinkService = projectLinkService;
        this.projectLinkRepository = projectLinkRepository;
    }

    /**
     * {@code POST  /project-links} : Create a new projectLink.
     *
     * @param projectLink the projectLink to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new projectLink, or with status {@code 400 (Bad Request)} if the projectLink has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/project-links")
    public ResponseEntity<ProjectLink> createProjectLink(@RequestBody ProjectLink projectLink) throws URISyntaxException {
        log.debug("REST request to save ProjectLink : {}", projectLink);
        if (projectLink.getId() != null) {
            throw new BadRequestAlertException("A new projectLink cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProjectLink result = projectLinkService.save(projectLink);
        return ResponseEntity
            .created(new URI("/api/project-links/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /project-links/:id} : Updates an existing projectLink.
     *
     * @param id the id of the projectLink to save.
     * @param projectLink the projectLink to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated projectLink,
     * or with status {@code 400 (Bad Request)} if the projectLink is not valid,
     * or with status {@code 500 (Internal Server Error)} if the projectLink couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/project-links/{id}")
    public ResponseEntity<ProjectLink> updateProjectLink(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProjectLink projectLink
    ) throws URISyntaxException {
        log.debug("REST request to update ProjectLink : {}, {}", id, projectLink);
        if (projectLink.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, projectLink.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!projectLinkRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ProjectLink result = projectLinkService.update(projectLink);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, projectLink.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /project-links/:id} : Partial updates given fields of an existing projectLink, field will ignore if it is null
     *
     * @param id the id of the projectLink to save.
     * @param projectLink the projectLink to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated projectLink,
     * or with status {@code 400 (Bad Request)} if the projectLink is not valid,
     * or with status {@code 404 (Not Found)} if the projectLink is not found,
     * or with status {@code 500 (Internal Server Error)} if the projectLink couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/project-links/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProjectLink> partialUpdateProjectLink(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProjectLink projectLink
    ) throws URISyntaxException {
        log.debug("REST request to partial update ProjectLink partially : {}, {}", id, projectLink);
        if (projectLink.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, projectLink.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!projectLinkRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProjectLink> result = projectLinkService.partialUpdate(projectLink);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, projectLink.getId().toString())
        );
    }

    /**
     * {@code GET  /project-links} : get all the projectLinks.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of projectLinks in body.
     */
    @GetMapping("/project-links")
    public List<ProjectLink> getAllProjectLinks(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all ProjectLinks");
        return projectLinkService.findAll();
    }

    /**
     * {@code GET  /project-links/:id} : get the "id" projectLink.
     *
     * @param id the id of the projectLink to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the projectLink, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/project-links/{id}")
    public ResponseEntity<ProjectLink> getProjectLink(@PathVariable Long id) {
        log.debug("REST request to get ProjectLink : {}", id);
        Optional<ProjectLink> projectLink = projectLinkService.findOne(id);
        return ResponseUtil.wrapOrNotFound(projectLink);
    }

    /**
     * {@code DELETE  /project-links/:id} : delete the "id" projectLink.
     *
     * @param id the id of the projectLink to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/project-links/{id}")
    public ResponseEntity<Void> deleteProjectLink(@PathVariable Long id) {
        log.debug("REST request to delete ProjectLink : {}", id);
        projectLinkService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
