package ch.letslink.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import ch.letslink.IntegrationTest;
import ch.letslink.domain.SellerProfile;
import ch.letslink.domain.enumeration.City;
import ch.letslink.domain.enumeration.Country;
import ch.letslink.repository.SellerProfileRepository;
import ch.letslink.service.SellerProfileService;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link SellerProfileResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class SellerProfileResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_STRIPE_ACCOUNT_ID = "AAAAAAAAAA";
    private static final String UPDATED_STRIPE_ACCOUNT_ID = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_SELLER = false;
    private static final Boolean UPDATED_IS_SELLER = true;

    private static final Boolean DEFAULT_CHARGES_ENABLED = false;
    private static final Boolean UPDATED_CHARGES_ENABLED = true;

    private static final String DEFAULT_ARTIST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_ARTIST_NAME = "BBBBBBBBBB";

    private static final byte[] DEFAULT_PICTURE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PICTURE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PICTURE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PICTURE_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "+Z@~N.<";
    private static final String UPDATED_EMAIL = "~dMe*e@(_Q+.yP(^&";

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    private static final City DEFAULT_CITY = City.BERN;
    private static final City UPDATED_CITY = City.BIENNE;

    private static final Country DEFAULT_COUNTRY = Country.CH;
    private static final Country UPDATED_COUNTRY = Country.CH;

    private static final String ENTITY_API_URL = "/api/seller-profiles";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SellerProfileRepository sellerProfileRepository;

    @Mock
    private SellerProfileRepository sellerProfileRepositoryMock;

    @Mock
    private SellerProfileService sellerProfileServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSellerProfileMockMvc;

    private SellerProfile sellerProfile;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SellerProfile createEntity(EntityManager em) {
        SellerProfile sellerProfile = new SellerProfile()
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .stripeAccountId(DEFAULT_STRIPE_ACCOUNT_ID)
            .isSeller(DEFAULT_IS_SELLER)
            .chargesEnabled(DEFAULT_CHARGES_ENABLED)
            .artistName(DEFAULT_ARTIST_NAME)
            .picture(DEFAULT_PICTURE)
            .pictureContentType(DEFAULT_PICTURE_CONTENT_TYPE)
            .description(DEFAULT_DESCRIPTION)
            .email(DEFAULT_EMAIL)
            .phone(DEFAULT_PHONE)
            .city(DEFAULT_CITY)
            .country(DEFAULT_COUNTRY);
        return sellerProfile;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SellerProfile createUpdatedEntity(EntityManager em) {
        SellerProfile sellerProfile = new SellerProfile()
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .stripeAccountId(UPDATED_STRIPE_ACCOUNT_ID)
            .isSeller(UPDATED_IS_SELLER)
            .chargesEnabled(UPDATED_CHARGES_ENABLED)
            .artistName(UPDATED_ARTIST_NAME)
            .picture(UPDATED_PICTURE)
            .pictureContentType(UPDATED_PICTURE_CONTENT_TYPE)
            .description(UPDATED_DESCRIPTION)
            .email(UPDATED_EMAIL)
            .phone(UPDATED_PHONE)
            .city(UPDATED_CITY)
            .country(UPDATED_COUNTRY);
        return sellerProfile;
    }

    @BeforeEach
    public void initTest() {
        sellerProfile = createEntity(em);
    }

    @Test
    @Transactional
    void createSellerProfile() throws Exception {
        int databaseSizeBeforeCreate = sellerProfileRepository.findAll().size();
        // Create the SellerProfile
        restSellerProfileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sellerProfile)))
            .andExpect(status().isCreated());

        // Validate the SellerProfile in the database
        List<SellerProfile> sellerProfileList = sellerProfileRepository.findAll();
        assertThat(sellerProfileList).hasSize(databaseSizeBeforeCreate + 1);
        SellerProfile testSellerProfile = sellerProfileList.get(sellerProfileList.size() - 1);
        assertThat(testSellerProfile.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testSellerProfile.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testSellerProfile.getStripeAccountId()).isEqualTo(DEFAULT_STRIPE_ACCOUNT_ID);
        assertThat(testSellerProfile.getIsSeller()).isEqualTo(DEFAULT_IS_SELLER);
        assertThat(testSellerProfile.getChargesEnabled()).isEqualTo(DEFAULT_CHARGES_ENABLED);
        assertThat(testSellerProfile.getArtistName()).isEqualTo(DEFAULT_ARTIST_NAME);
        assertThat(testSellerProfile.getPicture()).isEqualTo(DEFAULT_PICTURE);
        assertThat(testSellerProfile.getPictureContentType()).isEqualTo(DEFAULT_PICTURE_CONTENT_TYPE);
        assertThat(testSellerProfile.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testSellerProfile.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testSellerProfile.getPhone()).isEqualTo(DEFAULT_PHONE);
        assertThat(testSellerProfile.getCity()).isEqualTo(DEFAULT_CITY);
        assertThat(testSellerProfile.getCountry()).isEqualTo(DEFAULT_COUNTRY);
    }

    @Test
    @Transactional
    void createSellerProfileWithExistingId() throws Exception {
        // Create the SellerProfile with an existing ID
        sellerProfile.setId(1L);

        int databaseSizeBeforeCreate = sellerProfileRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSellerProfileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sellerProfile)))
            .andExpect(status().isBadRequest());

        // Validate the SellerProfile in the database
        List<SellerProfile> sellerProfileList = sellerProfileRepository.findAll();
        assertThat(sellerProfileList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSellerProfiles() throws Exception {
        // Initialize the database
        sellerProfileRepository.saveAndFlush(sellerProfile);

        // Get all the sellerProfileList
        restSellerProfileMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sellerProfile.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].stripeAccountId").value(hasItem(DEFAULT_STRIPE_ACCOUNT_ID)))
            .andExpect(jsonPath("$.[*].isSeller").value(hasItem(DEFAULT_IS_SELLER.booleanValue())))
            .andExpect(jsonPath("$.[*].chargesEnabled").value(hasItem(DEFAULT_CHARGES_ENABLED.booleanValue())))
            .andExpect(jsonPath("$.[*].artistName").value(hasItem(DEFAULT_ARTIST_NAME)))
            .andExpect(jsonPath("$.[*].pictureContentType").value(hasItem(DEFAULT_PICTURE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].picture").value(hasItem(Base64Utils.encodeToString(DEFAULT_PICTURE))))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE)))
            .andExpect(jsonPath("$.[*].city").value(hasItem(DEFAULT_CITY.toString())))
            .andExpect(jsonPath("$.[*].country").value(hasItem(DEFAULT_COUNTRY.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllSellerProfilesWithEagerRelationshipsIsEnabled() throws Exception {
        when(sellerProfileServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restSellerProfileMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(sellerProfileServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllSellerProfilesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(sellerProfileServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restSellerProfileMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(sellerProfileRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getSellerProfile() throws Exception {
        // Initialize the database
        sellerProfileRepository.saveAndFlush(sellerProfile);

        // Get the sellerProfile
        restSellerProfileMockMvc
            .perform(get(ENTITY_API_URL_ID, sellerProfile.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sellerProfile.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.stripeAccountId").value(DEFAULT_STRIPE_ACCOUNT_ID))
            .andExpect(jsonPath("$.isSeller").value(DEFAULT_IS_SELLER.booleanValue()))
            .andExpect(jsonPath("$.chargesEnabled").value(DEFAULT_CHARGES_ENABLED.booleanValue()))
            .andExpect(jsonPath("$.artistName").value(DEFAULT_ARTIST_NAME))
            .andExpect(jsonPath("$.pictureContentType").value(DEFAULT_PICTURE_CONTENT_TYPE))
            .andExpect(jsonPath("$.picture").value(Base64Utils.encodeToString(DEFAULT_PICTURE)))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE))
            .andExpect(jsonPath("$.city").value(DEFAULT_CITY.toString()))
            .andExpect(jsonPath("$.country").value(DEFAULT_COUNTRY.toString()));
    }

    @Test
    @Transactional
    void getNonExistingSellerProfile() throws Exception {
        // Get the sellerProfile
        restSellerProfileMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSellerProfile() throws Exception {
        // Initialize the database
        sellerProfileRepository.saveAndFlush(sellerProfile);

        int databaseSizeBeforeUpdate = sellerProfileRepository.findAll().size();

        // Update the sellerProfile
        SellerProfile updatedSellerProfile = sellerProfileRepository.findById(sellerProfile.getId()).get();
        // Disconnect from session so that the updates on updatedSellerProfile are not directly saved in db
        em.detach(updatedSellerProfile);
        updatedSellerProfile
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .stripeAccountId(UPDATED_STRIPE_ACCOUNT_ID)
            .isSeller(UPDATED_IS_SELLER)
            .chargesEnabled(UPDATED_CHARGES_ENABLED)
            .artistName(UPDATED_ARTIST_NAME)
            .picture(UPDATED_PICTURE)
            .pictureContentType(UPDATED_PICTURE_CONTENT_TYPE)
            .description(UPDATED_DESCRIPTION)
            .email(UPDATED_EMAIL)
            .phone(UPDATED_PHONE)
            .city(UPDATED_CITY)
            .country(UPDATED_COUNTRY);

        restSellerProfileMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSellerProfile.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSellerProfile))
            )
            .andExpect(status().isOk());

        // Validate the SellerProfile in the database
        List<SellerProfile> sellerProfileList = sellerProfileRepository.findAll();
        assertThat(sellerProfileList).hasSize(databaseSizeBeforeUpdate);
        SellerProfile testSellerProfile = sellerProfileList.get(sellerProfileList.size() - 1);
        assertThat(testSellerProfile.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testSellerProfile.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testSellerProfile.getStripeAccountId()).isEqualTo(UPDATED_STRIPE_ACCOUNT_ID);
        assertThat(testSellerProfile.getIsSeller()).isEqualTo(UPDATED_IS_SELLER);
        assertThat(testSellerProfile.getChargesEnabled()).isEqualTo(UPDATED_CHARGES_ENABLED);
        assertThat(testSellerProfile.getArtistName()).isEqualTo(UPDATED_ARTIST_NAME);
        assertThat(testSellerProfile.getPicture()).isEqualTo(UPDATED_PICTURE);
        assertThat(testSellerProfile.getPictureContentType()).isEqualTo(UPDATED_PICTURE_CONTENT_TYPE);
        assertThat(testSellerProfile.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSellerProfile.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testSellerProfile.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testSellerProfile.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testSellerProfile.getCountry()).isEqualTo(UPDATED_COUNTRY);
    }

    @Test
    @Transactional
    void putNonExistingSellerProfile() throws Exception {
        int databaseSizeBeforeUpdate = sellerProfileRepository.findAll().size();
        sellerProfile.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSellerProfileMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sellerProfile.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sellerProfile))
            )
            .andExpect(status().isBadRequest());

        // Validate the SellerProfile in the database
        List<SellerProfile> sellerProfileList = sellerProfileRepository.findAll();
        assertThat(sellerProfileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSellerProfile() throws Exception {
        int databaseSizeBeforeUpdate = sellerProfileRepository.findAll().size();
        sellerProfile.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSellerProfileMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sellerProfile))
            )
            .andExpect(status().isBadRequest());

        // Validate the SellerProfile in the database
        List<SellerProfile> sellerProfileList = sellerProfileRepository.findAll();
        assertThat(sellerProfileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSellerProfile() throws Exception {
        int databaseSizeBeforeUpdate = sellerProfileRepository.findAll().size();
        sellerProfile.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSellerProfileMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sellerProfile)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SellerProfile in the database
        List<SellerProfile> sellerProfileList = sellerProfileRepository.findAll();
        assertThat(sellerProfileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSellerProfileWithPatch() throws Exception {
        // Initialize the database
        sellerProfileRepository.saveAndFlush(sellerProfile);

        int databaseSizeBeforeUpdate = sellerProfileRepository.findAll().size();

        // Update the sellerProfile using partial update
        SellerProfile partialUpdatedSellerProfile = new SellerProfile();
        partialUpdatedSellerProfile.setId(sellerProfile.getId());

        partialUpdatedSellerProfile
            .lastName(UPDATED_LAST_NAME)
            .stripeAccountId(UPDATED_STRIPE_ACCOUNT_ID)
            .isSeller(UPDATED_IS_SELLER)
            .artistName(UPDATED_ARTIST_NAME)
            .picture(UPDATED_PICTURE)
            .pictureContentType(UPDATED_PICTURE_CONTENT_TYPE);

        restSellerProfileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSellerProfile.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSellerProfile))
            )
            .andExpect(status().isOk());

        // Validate the SellerProfile in the database
        List<SellerProfile> sellerProfileList = sellerProfileRepository.findAll();
        assertThat(sellerProfileList).hasSize(databaseSizeBeforeUpdate);
        SellerProfile testSellerProfile = sellerProfileList.get(sellerProfileList.size() - 1);
        assertThat(testSellerProfile.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testSellerProfile.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testSellerProfile.getStripeAccountId()).isEqualTo(UPDATED_STRIPE_ACCOUNT_ID);
        assertThat(testSellerProfile.getIsSeller()).isEqualTo(UPDATED_IS_SELLER);
        assertThat(testSellerProfile.getChargesEnabled()).isEqualTo(DEFAULT_CHARGES_ENABLED);
        assertThat(testSellerProfile.getArtistName()).isEqualTo(UPDATED_ARTIST_NAME);
        assertThat(testSellerProfile.getPicture()).isEqualTo(UPDATED_PICTURE);
        assertThat(testSellerProfile.getPictureContentType()).isEqualTo(UPDATED_PICTURE_CONTENT_TYPE);
        assertThat(testSellerProfile.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testSellerProfile.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testSellerProfile.getPhone()).isEqualTo(DEFAULT_PHONE);
        assertThat(testSellerProfile.getCity()).isEqualTo(DEFAULT_CITY);
        assertThat(testSellerProfile.getCountry()).isEqualTo(DEFAULT_COUNTRY);
    }

    @Test
    @Transactional
    void fullUpdateSellerProfileWithPatch() throws Exception {
        // Initialize the database
        sellerProfileRepository.saveAndFlush(sellerProfile);

        int databaseSizeBeforeUpdate = sellerProfileRepository.findAll().size();

        // Update the sellerProfile using partial update
        SellerProfile partialUpdatedSellerProfile = new SellerProfile();
        partialUpdatedSellerProfile.setId(sellerProfile.getId());

        partialUpdatedSellerProfile
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .stripeAccountId(UPDATED_STRIPE_ACCOUNT_ID)
            .isSeller(UPDATED_IS_SELLER)
            .chargesEnabled(UPDATED_CHARGES_ENABLED)
            .artistName(UPDATED_ARTIST_NAME)
            .picture(UPDATED_PICTURE)
            .pictureContentType(UPDATED_PICTURE_CONTENT_TYPE)
            .description(UPDATED_DESCRIPTION)
            .email(UPDATED_EMAIL)
            .phone(UPDATED_PHONE)
            .city(UPDATED_CITY)
            .country(UPDATED_COUNTRY);

        restSellerProfileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSellerProfile.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSellerProfile))
            )
            .andExpect(status().isOk());

        // Validate the SellerProfile in the database
        List<SellerProfile> sellerProfileList = sellerProfileRepository.findAll();
        assertThat(sellerProfileList).hasSize(databaseSizeBeforeUpdate);
        SellerProfile testSellerProfile = sellerProfileList.get(sellerProfileList.size() - 1);
        assertThat(testSellerProfile.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testSellerProfile.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testSellerProfile.getStripeAccountId()).isEqualTo(UPDATED_STRIPE_ACCOUNT_ID);
        assertThat(testSellerProfile.getIsSeller()).isEqualTo(UPDATED_IS_SELLER);
        assertThat(testSellerProfile.getChargesEnabled()).isEqualTo(UPDATED_CHARGES_ENABLED);
        assertThat(testSellerProfile.getArtistName()).isEqualTo(UPDATED_ARTIST_NAME);
        assertThat(testSellerProfile.getPicture()).isEqualTo(UPDATED_PICTURE);
        assertThat(testSellerProfile.getPictureContentType()).isEqualTo(UPDATED_PICTURE_CONTENT_TYPE);
        assertThat(testSellerProfile.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSellerProfile.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testSellerProfile.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testSellerProfile.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testSellerProfile.getCountry()).isEqualTo(UPDATED_COUNTRY);
    }

    @Test
    @Transactional
    void patchNonExistingSellerProfile() throws Exception {
        int databaseSizeBeforeUpdate = sellerProfileRepository.findAll().size();
        sellerProfile.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSellerProfileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sellerProfile.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sellerProfile))
            )
            .andExpect(status().isBadRequest());

        // Validate the SellerProfile in the database
        List<SellerProfile> sellerProfileList = sellerProfileRepository.findAll();
        assertThat(sellerProfileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSellerProfile() throws Exception {
        int databaseSizeBeforeUpdate = sellerProfileRepository.findAll().size();
        sellerProfile.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSellerProfileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sellerProfile))
            )
            .andExpect(status().isBadRequest());

        // Validate the SellerProfile in the database
        List<SellerProfile> sellerProfileList = sellerProfileRepository.findAll();
        assertThat(sellerProfileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSellerProfile() throws Exception {
        int databaseSizeBeforeUpdate = sellerProfileRepository.findAll().size();
        sellerProfile.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSellerProfileMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(sellerProfile))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SellerProfile in the database
        List<SellerProfile> sellerProfileList = sellerProfileRepository.findAll();
        assertThat(sellerProfileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSellerProfile() throws Exception {
        // Initialize the database
        sellerProfileRepository.saveAndFlush(sellerProfile);

        int databaseSizeBeforeDelete = sellerProfileRepository.findAll().size();

        // Delete the sellerProfile
        restSellerProfileMockMvc
            .perform(delete(ENTITY_API_URL_ID, sellerProfile.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SellerProfile> sellerProfileList = sellerProfileRepository.findAll();
        assertThat(sellerProfileList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
