package ch.letslink.domain;

import static org.assertj.core.api.Assertions.assertThat;

import ch.letslink.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProjectLinkTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProjectLink.class);
        ProjectLink projectLink1 = new ProjectLink();
        projectLink1.setId(1L);
        ProjectLink projectLink2 = new ProjectLink();
        projectLink2.setId(projectLink1.getId());
        assertThat(projectLink1).isEqualTo(projectLink2);
        projectLink2.setId(2L);
        assertThat(projectLink1).isNotEqualTo(projectLink2);
        projectLink1.setId(null);
        assertThat(projectLink1).isNotEqualTo(projectLink2);
    }
}
