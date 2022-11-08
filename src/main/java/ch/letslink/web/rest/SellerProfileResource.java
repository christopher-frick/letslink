package ch.letslink.web.rest;

import ch.letslink.domain.SellerProfile;
import ch.letslink.repository.SellerProfileRepository;
import ch.letslink.service.SellerProfileService;
import ch.letslink.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link ch.letslink.domain.SellerProfile}.
 */
@RestController
@RequestMapping("/api")
public class SellerProfileResource {

    private final Logger log = LoggerFactory.getLogger(SellerProfileResource.class);

    private static final String ENTITY_NAME = "sellerProfile";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SellerProfileService sellerProfileService;

    private final SellerProfileRepository sellerProfileRepository;

    public SellerProfileResource(SellerProfileService sellerProfileService, SellerProfileRepository sellerProfileRepository) {
        this.sellerProfileService = sellerProfileService;
        this.sellerProfileRepository = sellerProfileRepository;
    }

    /**
     * {@code POST  /seller-profiles} : Create a new sellerProfile.
     *
     * @param sellerProfile the sellerProfile to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sellerProfile, or with status {@code 400 (Bad Request)} if the sellerProfile has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/seller-profiles")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or (hasAuthority('ROLE_USER'))")
    public ResponseEntity<SellerProfile> createSellerProfile(@Valid @RequestBody SellerProfile sellerProfile) throws URISyntaxException {
        log.debug("REST request to save SellerProfile : {}", sellerProfile);
        if (sellerProfile.getId() != null) {
            throw new BadRequestAlertException("A new sellerProfile cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SellerProfile result = sellerProfileService.save(sellerProfile);
        return ResponseEntity
            .created(new URI("/api/seller-profiles/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /seller-profiles/:id} : Updates an existing sellerProfile.
     *
     * @param id the id of the sellerProfile to save.
     * @param sellerProfile the sellerProfile to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sellerProfile,
     * or with status {@code 400 (Bad Request)} if the sellerProfile is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sellerProfile couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/seller-profiles/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or (hasAuthority('ROLE_USER'))")
    public ResponseEntity<SellerProfile> updateSellerProfile(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody SellerProfile sellerProfile
    ) throws URISyntaxException {
        log.debug("REST request to update SellerProfile : {}, {}", id, sellerProfile);
        if (sellerProfile.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sellerProfile.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sellerProfileRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SellerProfile result = sellerProfileService.update(sellerProfile);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sellerProfile.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /seller-profiles/:id} : Partial updates given fields of an existing sellerProfile, field will ignore if it is null
     *
     * @param id the id of the sellerProfile to save.
     * @param sellerProfile the sellerProfile to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sellerProfile,
     * or with status {@code 400 (Bad Request)} if the sellerProfile is not valid,
     * or with status {@code 404 (Not Found)} if the sellerProfile is not found,
     * or with status {@code 500 (Internal Server Error)} if the sellerProfile couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/seller-profiles/{id}", consumes = { "application/json", "application/merge-patch+json" })
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or (hasAuthority('ROLE_USER'))")
    public ResponseEntity<SellerProfile> partialUpdateSellerProfile(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody SellerProfile sellerProfile
    ) throws URISyntaxException {
        log.debug("REST request to partial update SellerProfile partially : {}, {}", id, sellerProfile);
        if (sellerProfile.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sellerProfile.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sellerProfileRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SellerProfile> result = sellerProfileService.partialUpdate(sellerProfile);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sellerProfile.getId().toString())
        );
    }

    /**
     * {@code GET  /seller-profiles} : get all the sellerProfiles.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sellerProfiles in body.
     */
    @GetMapping("/seller-profiles")
    public List<SellerProfile> getAllSellerProfiles(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all SellerProfiles");
        return sellerProfileService.findAll();
    }

    /**
     * {@code GET  /seller-profiles/:id} : get the "id" sellerProfile.
     *
     * @param id the id of the sellerProfile to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sellerProfile, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/seller-profiles/{id}")
    public ResponseEntity<SellerProfile> getSellerProfile(@PathVariable Long id) {
        log.debug("REST request to get SellerProfile : {}", id);
        Optional<SellerProfile> sellerProfile = sellerProfileService.findOne(id);
        return ResponseUtil.wrapOrNotFound(sellerProfile);
    }

    /**
     * {@code DELETE  /seller-profiles/:id} : delete the "id" sellerProfile.
     *
     * @param id the id of the sellerProfile to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/seller-profiles/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteSellerProfile(@PathVariable Long id) {
        log.debug("REST request to delete SellerProfile : {}", id);
        sellerProfileService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
