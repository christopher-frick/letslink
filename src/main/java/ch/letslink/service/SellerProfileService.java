package ch.letslink.service;

import ch.letslink.domain.SellerProfile;
import ch.letslink.repository.SellerProfileRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link SellerProfile}.
 */
@Service
@Transactional
public class SellerProfileService {

    private final Logger log = LoggerFactory.getLogger(SellerProfileService.class);

    private final SellerProfileRepository sellerProfileRepository;

    public SellerProfileService(SellerProfileRepository sellerProfileRepository) {
        this.sellerProfileRepository = sellerProfileRepository;
    }

    /**
     * Save a sellerProfile.
     *
     * @param sellerProfile the entity to save.
     * @return the persisted entity.
     */
    public SellerProfile save(SellerProfile sellerProfile) {
        log.debug("Request to save SellerProfile : {}", sellerProfile);
        return sellerProfileRepository.save(sellerProfile);
    }

    /**
     * Update a sellerProfile.
     *
     * @param sellerProfile the entity to save.
     * @return the persisted entity.
     */
    public SellerProfile update(SellerProfile sellerProfile) {
        log.debug("Request to update SellerProfile : {}", sellerProfile);
        return sellerProfileRepository.save(sellerProfile);
    }

    /**
     * Partially update a sellerProfile.
     *
     * @param sellerProfile the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<SellerProfile> partialUpdate(SellerProfile sellerProfile) {
        log.debug("Request to partially update SellerProfile : {}", sellerProfile);

        return sellerProfileRepository
            .findById(sellerProfile.getId())
            .map(existingSellerProfile -> {
                if (sellerProfile.getFirstName() != null) {
                    existingSellerProfile.setFirstName(sellerProfile.getFirstName());
                }
                if (sellerProfile.getLastName() != null) {
                    existingSellerProfile.setLastName(sellerProfile.getLastName());
                }
                if (sellerProfile.getStripeAccountId() != null) {
                    existingSellerProfile.setStripeAccountId(sellerProfile.getStripeAccountId());
                }
                if (sellerProfile.getIsSeller() != null) {
                    existingSellerProfile.setIsSeller(sellerProfile.getIsSeller());
                }
                if (sellerProfile.getChargesEnabled() != null) {
                    existingSellerProfile.setChargesEnabled(sellerProfile.getChargesEnabled());
                }
                if (sellerProfile.getArtistName() != null) {
                    existingSellerProfile.setArtistName(sellerProfile.getArtistName());
                }
                if (sellerProfile.getPicture() != null) {
                    existingSellerProfile.setPicture(sellerProfile.getPicture());
                }
                if (sellerProfile.getPictureContentType() != null) {
                    existingSellerProfile.setPictureContentType(sellerProfile.getPictureContentType());
                }
                if (sellerProfile.getDescription() != null) {
                    existingSellerProfile.setDescription(sellerProfile.getDescription());
                }
                if (sellerProfile.getEmail() != null) {
                    existingSellerProfile.setEmail(sellerProfile.getEmail());
                }
                if (sellerProfile.getPhone() != null) {
                    existingSellerProfile.setPhone(sellerProfile.getPhone());
                }
                if (sellerProfile.getCity() != null) {
                    existingSellerProfile.setCity(sellerProfile.getCity());
                }
                if (sellerProfile.getCountry() != null) {
                    existingSellerProfile.setCountry(sellerProfile.getCountry());
                }

                return existingSellerProfile;
            })
            .map(sellerProfileRepository::save);
    }

    /**
     * Get all the sellerProfiles.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<SellerProfile> findAll() {
        log.debug("Request to get all SellerProfiles");
        return sellerProfileRepository.findAll();
    }

    /**
     * Get all the sellerProfiles with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<SellerProfile> findAllWithEagerRelationships(Pageable pageable) {
        return sellerProfileRepository.findAllWithEagerRelationships(pageable);
    }

    /**
     * Get one sellerProfile by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<SellerProfile> findOne(Long id) {
        log.debug("Request to get SellerProfile : {}", id);
        return sellerProfileRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the sellerProfile by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete SellerProfile : {}", id);
        sellerProfileRepository.deleteById(id);
    }
}
