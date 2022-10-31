package ch.letslink.domain;

import static org.assertj.core.api.Assertions.assertThat;

import ch.letslink.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SellerProfileTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SellerProfile.class);
        SellerProfile sellerProfile1 = new SellerProfile();
        sellerProfile1.setId(1L);
        SellerProfile sellerProfile2 = new SellerProfile();
        sellerProfile2.setId(sellerProfile1.getId());
        assertThat(sellerProfile1).isEqualTo(sellerProfile2);
        sellerProfile2.setId(2L);
        assertThat(sellerProfile1).isNotEqualTo(sellerProfile2);
        sellerProfile1.setId(null);
        assertThat(sellerProfile1).isNotEqualTo(sellerProfile2);
    }
}
