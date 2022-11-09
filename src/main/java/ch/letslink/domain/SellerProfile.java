package ch.letslink.domain;

import ch.letslink.domain.enumeration.City;
import ch.letslink.domain.enumeration.Country;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * Profile collect all information for a Seller so he can start provide Products and Services
 */
@Schema(description = "Profile collect all information for a Seller so he can start provide Products and Services")
@Entity
@Table(name = "seller_profile")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SellerProfile implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "stripe_account_id")
    private String stripeAccountId;

    @Column(name = "artist_name")
    private String artistName;

    @Lob
    @Column(name = "picture")
    private byte[] picture;

    @Column(name = "picture_content_type")
    private String pictureContentType;

    @Column(name = "description")
    private String description;

    @Pattern(regexp = "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")
    @Column(name = "email")
    private String email;

    @Column(name = "phone")
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "city")
    private City city;

    @Enumerated(EnumType.STRING)
    @Column(name = "country")
    private Country country;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @OneToMany(mappedBy = "sellerProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "sellerProfile" }, allowSetters = true)
    private Set<Product> products = new HashSet<>();

    @OneToMany(mappedBy = "sellerProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "sellerProfile" }, allowSetters = true)
    private Set<ProjectLink> projectLinks = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SellerProfile id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public SellerProfile firstName(String firstName) {
        this.setFirstName(firstName);
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public SellerProfile lastName(String lastName) {
        this.setLastName(lastName);
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getStripeAccountId() {
        return this.stripeAccountId;
    }

    public SellerProfile stripeAccountId(String stripeAccountId) {
        this.setStripeAccountId(stripeAccountId);
        return this;
    }

    public void setStripeAccountId(String stripeAccountId) {
        this.stripeAccountId = stripeAccountId;
    }

    public String getArtistName() {
        return this.artistName;
    }

    public SellerProfile artistName(String artistName) {
        this.setArtistName(artistName);
        return this;
    }

    public void setArtistName(String artistName) {
        this.artistName = artistName;
    }

    public byte[] getPicture() {
        return this.picture;
    }

    public SellerProfile picture(byte[] picture) {
        this.setPicture(picture);
        return this;
    }

    public void setPicture(byte[] picture) {
        this.picture = picture;
    }

    public String getPictureContentType() {
        return this.pictureContentType;
    }

    public SellerProfile pictureContentType(String pictureContentType) {
        this.pictureContentType = pictureContentType;
        return this;
    }

    public void setPictureContentType(String pictureContentType) {
        this.pictureContentType = pictureContentType;
    }

    public String getDescription() {
        return this.description;
    }

    public SellerProfile description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEmail() {
        return this.email;
    }

    public SellerProfile email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return this.phone;
    }

    public SellerProfile phone(String phone) {
        this.setPhone(phone);
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public City getCity() {
        return this.city;
    }

    public SellerProfile city(City city) {
        this.setCity(city);
        return this;
    }

    public void setCity(City city) {
        this.city = city;
    }

    public Country getCountry() {
        return this.country;
    }

    public SellerProfile country(Country country) {
        this.setCountry(country);
        return this;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public SellerProfile user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<Product> getProducts() {
        return this.products;
    }

    public void setProducts(Set<Product> products) {
        if (this.products != null) {
            this.products.forEach(i -> i.setSellerProfile(null));
        }
        if (products != null) {
            products.forEach(i -> i.setSellerProfile(this));
        }
        this.products = products;
    }

    public SellerProfile products(Set<Product> products) {
        this.setProducts(products);
        return this;
    }

    public SellerProfile addProduct(Product product) {
        this.products.add(product);
        product.setSellerProfile(this);
        return this;
    }

    public SellerProfile removeProduct(Product product) {
        this.products.remove(product);
        product.setSellerProfile(null);
        return this;
    }

    public Set<ProjectLink> getProjectLinks() {
        return this.projectLinks;
    }

    public void setProjectLinks(Set<ProjectLink> projectLinks) {
        if (this.projectLinks != null) {
            this.projectLinks.forEach(i -> i.setSellerProfile(null));
        }
        if (projectLinks != null) {
            projectLinks.forEach(i -> i.setSellerProfile(this));
        }
        this.projectLinks = projectLinks;
    }

    public SellerProfile projectLinks(Set<ProjectLink> projectLinks) {
        this.setProjectLinks(projectLinks);
        return this;
    }

    public SellerProfile addProjectLink(ProjectLink projectLink) {
        this.projectLinks.add(projectLink);
        projectLink.setSellerProfile(this);
        return this;
    }

    public SellerProfile removeProjectLink(ProjectLink projectLink) {
        this.projectLinks.remove(projectLink);
        projectLink.setSellerProfile(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SellerProfile)) {
            return false;
        }
        return id != null && id.equals(((SellerProfile) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SellerProfile{" +
            "id=" + getId() +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", stripeAccountId='" + getStripeAccountId() + "'" +
            ", artistName='" + getArtistName() + "'" +
            ", picture='" + getPicture() + "'" +
            ", pictureContentType='" + getPictureContentType() + "'" +
            ", description='" + getDescription() + "'" +
            ", email='" + getEmail() + "'" +
            ", phone='" + getPhone() + "'" +
            ", city='" + getCity() + "'" +
            ", country='" + getCountry() + "'" +
            "}";
    }
}
