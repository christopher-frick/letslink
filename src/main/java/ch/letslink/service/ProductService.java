package ch.letslink.service;

import ch.letslink.domain.Product;
import ch.letslink.repository.ProductRepository;
import ch.letslink.repository.SellerProfileRepository;
import ch.letslink.security.AuthoritiesConstants;
import ch.letslink.security.SecurityUtils;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Product}.
 */
@Service
@Transactional
public class ProductService {

    private final Logger log = LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository productRepository;
    private final SellerProfileRepository sellerProfileRepository;

    public ProductService(ProductRepository productRepository, SellerProfileRepository sellerProfileRepository) {
        this.productRepository = productRepository;
        this.sellerProfileRepository = sellerProfileRepository;
    }

    /**
     * Save a product.
     *
     * @param product the entity to save.
     * @return the persisted entity.
     */
    public Product save(Product product) {
        log.debug("Request to save Product : {}", product);
        if (SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)) {
            return productRepository.save(product);
        } else if (SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.USER)) {
            if (product.getSellerProfile() != null) {
                if (SecurityUtils.getCurrentUserLogin().isPresent()) {
                    if (product.getSellerProfile().getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().get())) {
                        return productRepository.save(product);
                    } else {
                        throw new RuntimeException(
                            "You are not allowed to save this product because you are not the owner of the sellerProfile"
                        );
                    }
                }
            } else if (SecurityUtils.getCurrentUser().isPresent()) {
                product.setSellerProfile(sellerProfileRepository.findByUserLogin(SecurityUtils.getCurrentUserLogin().get()).get());
                if (product.getSellerProfile() != null) {
                    return productRepository.save(product);
                } else {
                    throw new RuntimeException("The current user does not have a sellerProfile");
                }
            }
            return productRepository.save(product);
        }
        return productRepository.save(product);
    }

    /**
     * Update a product.
     *
     * @param product the entity to save.
     * @return the persisted entity.
     */
    public Product update(Product product) {
        log.debug("Request to update Product : {}", product);
        if (SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)) {
            return productRepository.save(product);
        } else if (SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.USER)) {
            if (product.getSellerProfile() != null) {
                if (SecurityUtils.getCurrentUserLogin().isPresent()) {
                    if (product.getSellerProfile().getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().get())) {
                        return productRepository.save(product);
                    } else {
                        throw new RuntimeException(
                            "You are not allowed to save this product because you are not the " +
                            "owner of the sellerProfile associated with this product"
                        );
                    }
                }
            } else if (SecurityUtils.getCurrentUser().isPresent()) {
                product.setSellerProfile(sellerProfileRepository.findByUserLogin(SecurityUtils.getCurrentUserLogin().get()).get());
                if (product.getSellerProfile() != null) {
                    return productRepository.save(product);
                } else {
                    throw new RuntimeException("The current user does not have a sellerProfile");
                }
            }
            return productRepository.save(product);
        }
        return productRepository.save(product);
    }

    /**
     * Partially update a product.
     *
     * @param product the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Product> partialUpdate(Product product) {
        log.debug("Request to partially update Product : {}", product);
        //if admin, update the product
        //if user, check if the product has a sellerProfile
        //if it has a sellerProfile, check if the sellerProfile is the same as the current sellerProfile
        //if it is the same, update the product
        //if it is not the same, throw an exception
        //if it does not have a sellerProfile, set the sellerProfile to the current sellerProfile and update the product
        if (SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)) {
            return productRepository
                .findById(product.getId())
                .map(existingProduct -> {
                    if (product.getName() != null) {
                        existingProduct.setName(product.getName());
                    }
                    if (product.getDescription() != null) {
                        existingProduct.setDescription(product.getDescription());
                    }
                    if (product.getPicture() != null) {
                        existingProduct.setPicture(product.getPicture());
                    }
                    if (product.getPictureContentType() != null) {
                        existingProduct.setPictureContentType(product.getPictureContentType());
                    }
                    if (product.getProductCategory() != null) {
                        existingProduct.setProductCategory(product.getProductCategory());
                    }
                    if (product.getPrice() != null) {
                        existingProduct.setPrice(product.getPrice());
                    }
                    if (product.getFile() != null) {
                        existingProduct.setFile(product.getFile());
                    }
                    if (product.getFileContentType() != null) {
                        existingProduct.setFileContentType(product.getFileContentType());
                    }

                    return existingProduct;
                })
                .map(productRepository::save);
        } else if (SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.USER)) {
            if (product.getSellerProfile() != null) {
                if (SecurityUtils.getCurrentUserLogin().isPresent()) {
                    if (product.getSellerProfile().getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().get())) {
                        return productRepository
                            .findById(product.getId())
                            .map(existingProduct -> {
                                if (product.getName() != null) {
                                    existingProduct.setName(product.getName());
                                }
                                if (product.getDescription() != null) {
                                    existingProduct.setDescription(product.getDescription());
                                }
                                if (product.getPicture() != null) {
                                    existingProduct.setPicture(product.getPicture());
                                }
                                if (product.getPictureContentType() != null) {
                                    existingProduct.setPictureContentType(product.getPictureContentType());
                                }
                                if (product.getProductCategory() != null) {
                                    existingProduct.setProductCategory(product.getProductCategory());
                                }
                                if (product.getPrice() != null) {
                                    existingProduct.setPrice(product.getPrice());
                                }
                                if (product.getFile() != null) {
                                    existingProduct.setFile(product.getFile());
                                }
                                if (product.getFileContentType() != null) {
                                    existingProduct.setFileContentType(product.getFileContentType());
                                }

                                return existingProduct;
                            })
                            .map(productRepository::save);
                    } else {
                        throw new RuntimeException(
                            "You are not allowed to update this product because you are not the owner of the sellerProfile associated with this product"
                        );
                    }
                }
            } else if (SecurityUtils.getCurrentUser().isPresent()) {
                product.setSellerProfile(sellerProfileRepository.findByUserLogin(SecurityUtils.getCurrentUserLogin().get()).get());
                if (product.getSellerProfile() != null) {
                    return productRepository
                        .findById(product.getId())
                        .map(existingProduct -> {
                            if (product.getName() != null) {
                                existingProduct.setName(product.getName());
                            }
                            if (product.getDescription() != null) {
                                existingProduct.setDescription(product.getDescription());
                            }
                            if (product.getPicture() != null) {
                                existingProduct.setPicture(product.getPicture());
                            }
                            if (product.getPictureContentType() != null) {
                                existingProduct.setPictureContentType(product.getPictureContentType());
                            }
                            if (product.getProductCategory() != null) {
                                existingProduct.setProductCategory(product.getProductCategory());
                            }
                            if (product.getPrice() != null) {
                                existingProduct.setPrice(product.getPrice());
                            }
                            if (product.getFile() != null) {
                                existingProduct.setFile(product.getFile());
                            }
                            if (product.getFileContentType() != null) {
                                existingProduct.setFileContentType(product.getFileContentType());
                            }
                            return existingProduct;
                        })
                        .map(productRepository::save);
                } else {
                    throw new RuntimeException("The current user does not have a sellerProfile");
                }
            }
            return productRepository
                .findById(product.getId())
                .map(existingProduct -> {
                    if (product.getName() != null) {
                        existingProduct.setName(product.getName());
                    }
                    if (product.getDescription() != null) {
                        existingProduct.setDescription(product.getDescription());
                    }
                    if (product.getPicture() != null) {
                        existingProduct.setPicture(product.getPicture());
                    }
                    if (product.getPictureContentType() != null) {
                        existingProduct.setPictureContentType(product.getPictureContentType());
                    }
                    if (product.getProductCategory() != null) {
                        existingProduct.setProductCategory(product.getProductCategory());
                    }
                    if (product.getPrice() != null) {
                        existingProduct.setPrice(product.getPrice());
                    }
                    if (product.getFile() != null) {
                        existingProduct.setFile(product.getFile());
                    }
                    if (product.getFileContentType() != null) {
                        existingProduct.setFileContentType(product.getFileContentType());
                    }
                    return existingProduct;
                })
                .map(productRepository::save);
        } else {
            throw new RuntimeException("You are not allowed to update this product");
        }
    }

    /**
     * Get all the products.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Product> findAll() {
        log.debug("Request to get all Products");
        return productRepository.findAll();
    }

    /**
     * Get all the products with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<Product> findAllWithEagerRelationships(Pageable pageable) {
        return productRepository.findAllWithEagerRelationships(pageable);
    }

    /**
     * Get one product by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Product> findOne(Long id) {
        log.debug("Request to get Product : {}", id);
        return productRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the product by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Product : {}", id);
        productRepository.deleteById(id);
    }
}
