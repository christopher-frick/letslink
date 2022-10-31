package ch.letslink.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import ch.letslink.IntegrationTest;
import ch.letslink.domain.ProjectLink;
import ch.letslink.repository.ProjectLinkRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ProjectLinkResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProjectLinkResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_URL = "AAAAAAAAAA";
    private static final String UPDATED_URL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/project-links";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProjectLinkRepository projectLinkRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProjectLinkMockMvc;

    private ProjectLink projectLink;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProjectLink createEntity(EntityManager em) {
        ProjectLink projectLink = new ProjectLink().name(DEFAULT_NAME).url(DEFAULT_URL);
        return projectLink;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProjectLink createUpdatedEntity(EntityManager em) {
        ProjectLink projectLink = new ProjectLink().name(UPDATED_NAME).url(UPDATED_URL);
        return projectLink;
    }

    @BeforeEach
    public void initTest() {
        projectLink = createEntity(em);
    }

    @Test
    @Transactional
    void createProjectLink() throws Exception {
        int databaseSizeBeforeCreate = projectLinkRepository.findAll().size();
        // Create the ProjectLink
        restProjectLinkMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(projectLink)))
            .andExpect(status().isCreated());

        // Validate the ProjectLink in the database
        List<ProjectLink> projectLinkList = projectLinkRepository.findAll();
        assertThat(projectLinkList).hasSize(databaseSizeBeforeCreate + 1);
        ProjectLink testProjectLink = projectLinkList.get(projectLinkList.size() - 1);
        assertThat(testProjectLink.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testProjectLink.getUrl()).isEqualTo(DEFAULT_URL);
    }

    @Test
    @Transactional
    void createProjectLinkWithExistingId() throws Exception {
        // Create the ProjectLink with an existing ID
        projectLink.setId(1L);

        int databaseSizeBeforeCreate = projectLinkRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProjectLinkMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(projectLink)))
            .andExpect(status().isBadRequest());

        // Validate the ProjectLink in the database
        List<ProjectLink> projectLinkList = projectLinkRepository.findAll();
        assertThat(projectLinkList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProjectLinks() throws Exception {
        // Initialize the database
        projectLinkRepository.saveAndFlush(projectLink);

        // Get all the projectLinkList
        restProjectLinkMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(projectLink.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].url").value(hasItem(DEFAULT_URL)));
    }

    @Test
    @Transactional
    void getProjectLink() throws Exception {
        // Initialize the database
        projectLinkRepository.saveAndFlush(projectLink);

        // Get the projectLink
        restProjectLinkMockMvc
            .perform(get(ENTITY_API_URL_ID, projectLink.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(projectLink.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.url").value(DEFAULT_URL));
    }

    @Test
    @Transactional
    void getNonExistingProjectLink() throws Exception {
        // Get the projectLink
        restProjectLinkMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProjectLink() throws Exception {
        // Initialize the database
        projectLinkRepository.saveAndFlush(projectLink);

        int databaseSizeBeforeUpdate = projectLinkRepository.findAll().size();

        // Update the projectLink
        ProjectLink updatedProjectLink = projectLinkRepository.findById(projectLink.getId()).get();
        // Disconnect from session so that the updates on updatedProjectLink are not directly saved in db
        em.detach(updatedProjectLink);
        updatedProjectLink.name(UPDATED_NAME).url(UPDATED_URL);

        restProjectLinkMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProjectLink.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProjectLink))
            )
            .andExpect(status().isOk());

        // Validate the ProjectLink in the database
        List<ProjectLink> projectLinkList = projectLinkRepository.findAll();
        assertThat(projectLinkList).hasSize(databaseSizeBeforeUpdate);
        ProjectLink testProjectLink = projectLinkList.get(projectLinkList.size() - 1);
        assertThat(testProjectLink.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProjectLink.getUrl()).isEqualTo(UPDATED_URL);
    }

    @Test
    @Transactional
    void putNonExistingProjectLink() throws Exception {
        int databaseSizeBeforeUpdate = projectLinkRepository.findAll().size();
        projectLink.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProjectLinkMockMvc
            .perform(
                put(ENTITY_API_URL_ID, projectLink.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectLink))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectLink in the database
        List<ProjectLink> projectLinkList = projectLinkRepository.findAll();
        assertThat(projectLinkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProjectLink() throws Exception {
        int databaseSizeBeforeUpdate = projectLinkRepository.findAll().size();
        projectLink.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectLinkMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectLink))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectLink in the database
        List<ProjectLink> projectLinkList = projectLinkRepository.findAll();
        assertThat(projectLinkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProjectLink() throws Exception {
        int databaseSizeBeforeUpdate = projectLinkRepository.findAll().size();
        projectLink.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectLinkMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(projectLink)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProjectLink in the database
        List<ProjectLink> projectLinkList = projectLinkRepository.findAll();
        assertThat(projectLinkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProjectLinkWithPatch() throws Exception {
        // Initialize the database
        projectLinkRepository.saveAndFlush(projectLink);

        int databaseSizeBeforeUpdate = projectLinkRepository.findAll().size();

        // Update the projectLink using partial update
        ProjectLink partialUpdatedProjectLink = new ProjectLink();
        partialUpdatedProjectLink.setId(projectLink.getId());

        restProjectLinkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProjectLink.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProjectLink))
            )
            .andExpect(status().isOk());

        // Validate the ProjectLink in the database
        List<ProjectLink> projectLinkList = projectLinkRepository.findAll();
        assertThat(projectLinkList).hasSize(databaseSizeBeforeUpdate);
        ProjectLink testProjectLink = projectLinkList.get(projectLinkList.size() - 1);
        assertThat(testProjectLink.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testProjectLink.getUrl()).isEqualTo(DEFAULT_URL);
    }

    @Test
    @Transactional
    void fullUpdateProjectLinkWithPatch() throws Exception {
        // Initialize the database
        projectLinkRepository.saveAndFlush(projectLink);

        int databaseSizeBeforeUpdate = projectLinkRepository.findAll().size();

        // Update the projectLink using partial update
        ProjectLink partialUpdatedProjectLink = new ProjectLink();
        partialUpdatedProjectLink.setId(projectLink.getId());

        partialUpdatedProjectLink.name(UPDATED_NAME).url(UPDATED_URL);

        restProjectLinkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProjectLink.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProjectLink))
            )
            .andExpect(status().isOk());

        // Validate the ProjectLink in the database
        List<ProjectLink> projectLinkList = projectLinkRepository.findAll();
        assertThat(projectLinkList).hasSize(databaseSizeBeforeUpdate);
        ProjectLink testProjectLink = projectLinkList.get(projectLinkList.size() - 1);
        assertThat(testProjectLink.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProjectLink.getUrl()).isEqualTo(UPDATED_URL);
    }

    @Test
    @Transactional
    void patchNonExistingProjectLink() throws Exception {
        int databaseSizeBeforeUpdate = projectLinkRepository.findAll().size();
        projectLink.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProjectLinkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, projectLink.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(projectLink))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectLink in the database
        List<ProjectLink> projectLinkList = projectLinkRepository.findAll();
        assertThat(projectLinkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProjectLink() throws Exception {
        int databaseSizeBeforeUpdate = projectLinkRepository.findAll().size();
        projectLink.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectLinkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(projectLink))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectLink in the database
        List<ProjectLink> projectLinkList = projectLinkRepository.findAll();
        assertThat(projectLinkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProjectLink() throws Exception {
        int databaseSizeBeforeUpdate = projectLinkRepository.findAll().size();
        projectLink.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectLinkMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(projectLink))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProjectLink in the database
        List<ProjectLink> projectLinkList = projectLinkRepository.findAll();
        assertThat(projectLinkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProjectLink() throws Exception {
        // Initialize the database
        projectLinkRepository.saveAndFlush(projectLink);

        int databaseSizeBeforeDelete = projectLinkRepository.findAll().size();

        // Delete the projectLink
        restProjectLinkMockMvc
            .perform(delete(ENTITY_API_URL_ID, projectLink.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProjectLink> projectLinkList = projectLinkRepository.findAll();
        assertThat(projectLinkList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
