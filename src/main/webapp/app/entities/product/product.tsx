import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Table } from 'reactstrap';
import { byteSize, openFile, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities } from './product.reducer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

export const Product = (sellerProfile = null) => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const productList = useAppSelector(state => state.product.entities);
  const loading = useAppSelector(state => state.product.loading);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]));
  const account = useAppSelector(state => state.authentication.account);
  const isLoggedUserOwnerSellerProfile = sellerProfile.sellerProfileEntity.user?.id === account?.id;

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  return (
    <Card className="card-header text-center align-content-center">
      <h2 id="product-heading" data-cy="ProductHeading">
        <Translate contentKey="letslinkApp.product.home.title">Products</Translate>
      </h2>
      <div className="d-flex justify-content-end">
        <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
          <FontAwesomeIcon icon="sync" spin={loading} />{' '}
          <Translate contentKey="letslinkApp.product.home.refreshListLabel">Refresh</Translate>
        </Button>
        {isAuthenticated && (isAdmin || isLoggedUserOwnerSellerProfile) && (
          <Button onClick={() => navigate('/product/new')} color="primary" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            <Translate contentKey="letslinkApp.product.home.createLabel">Create a new Product</Translate>
          </Button>
        )}
      </div>
      <ProductList
        productList={productList}
        loading={loading}
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        account={account}
        isLoggedUserOwnerSellerProfile={isLoggedUserOwnerSellerProfile}
        sellerProfileEntity={sellerProfile.sellerProfileEntity}
      />
    </Card>
  );
};

const ProductList = ({ productList, loading, sellerProfileEntity, isAuthenticated, isAdmin, account, isLoggedUserOwnerSellerProfile }) => {
  return productList && productList.length > 0 ? (
    <div>
      {(isAdmin &&
        productList.map((product, i) => (
          <ProductItem
            key={`product-entity-${i}`}
            productEntity={product}
            sellerProfileEntity={sellerProfileEntity}
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin}
            account={account}
          />
        ))) ||
        productList
          .filter(product => product.sellerProfile?.id === sellerProfileEntity.id)
          .map((product, i) => (
            <ProductItem
              key={`product-entity-${i}`}
              productEntity={product}
              sellerProfileEntity={sellerProfileEntity}
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              account={account}
            />
          ))}
    </div>
  ) : (
    !loading && (
      <div className="alert alert-warning">
        <Translate contentKey="letslinkApp.product.home.notFound">No Products found</Translate>
      </div>
    )
  );
};
const ProductItem = ({ productEntity, sellerProfileEntity, isAuthenticated, isAdmin, account }) => {
  return (
    <Card className="card text-white bg-dark mb-3">
      <Card className="card-header text-white bg-dark mb-3 text-center align-content-center">
        <ProductPicture productEntity={productEntity} />
        <ButtonGroupEditDelete
          productEntity={productEntity}
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
          account={account}
          sellerProfile={sellerProfileEntity}
        />
      </Card>
      <ProductDetails productEntity={productEntity} />
    </Card>
  );
};

const ButtonGroupEditDelete = ({ sellerProfile, isAdmin, account, isAuthenticated, productEntity }) => {
  return (
    isAuthenticated && (
      <div className="btn-group flex-btn-group-container">
        {(isAdmin || sellerProfile.user?.id === account?.id) && (
          <Button tag={Link} to={`/product/${productEntity?.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
            <FontAwesomeIcon icon="pencil-alt" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.edit">Edit</Translate>
            </span>
          </Button>
        )}
        {isAuthenticated &&
          ((isAdmin && (
            <Button tag={Link} to={`/product/${productEntity.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
              <FontAwesomeIcon icon="trash" />{' '}
              <span className="d-none d-md-inline">
                <Translate contentKey="entity.action.delete">Delete</Translate>
              </span>
            </Button>
          )) ||
            (sellerProfile.user?.id === account?.id && (
              <Button tag={Link} to={`/product/${productEntity.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
                <FontAwesomeIcon icon="trash" />{' '}
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.delete">Delete</Translate>
                </span>
              </Button>
            )))}
      </div>
    )
  );
};
const ProductPicture = ({ productEntity }) => {
  return productEntity?.pictureContentType ? (
    <img src={`data:${productEntity.pictureContentType};base64,${productEntity.picture}`} className="img-fluid" />
  ) : null;
};

const ProductDetails = ({ productEntity }) => {
  return (
    <Card className={'card-body text-white bg-dark mb-3'}>
      <h4 className="card-title text-center">{productEntity?.name ? productEntity.artistName : 'No Artist Name!'}</h4>
      <p className="card-text text-center">{productEntity.price ? productEntity.price : 'No Price!'}</p>
      <p className="card-text">{productEntity?.description ? productEntity.description : 'No description!'}</p>
      {productEntity.file ? (
        <div>
          {productEntity.fileContentType ? (
            <a onClick={openFile(productEntity.fileContentType, productEntity.file)}>
              <Translate contentKey="entity.action.open">Open</Translate>
              &nbsp;
            </a>
          ) : null}
          <span>
            {productEntity.fileContentType}, {byteSize(productEntity.file)}
          </span>
        </div>
      ) : null}
    </Card>
  );
};

export const OldProduct = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const productList = useAppSelector(state => state.product.entities);
  const loading = useAppSelector(state => state.product.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  return (
    <div>
      <h2 id="product-heading" data-cy="ProductHeading">
        <Translate contentKey="letslinkApp.product.home.title">Products</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="letslinkApp.product.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/product/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="letslinkApp.product.home.createLabel">Create new Product</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {productList && productList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="letslinkApp.product.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="letslinkApp.product.name">Name</Translate>
                </th>
                <th>
                  <Translate contentKey="letslinkApp.product.description">Description</Translate>
                </th>
                <th>
                  <Translate contentKey="letslinkApp.product.picture">Picture</Translate>
                </th>
                <th>
                  <Translate contentKey="letslinkApp.product.productCategory">Product Category</Translate>
                </th>
                <th>
                  <Translate contentKey="letslinkApp.product.price">Price</Translate>
                </th>
                <th>
                  <Translate contentKey="letslinkApp.product.file">File</Translate>
                </th>
                <th>
                  <Translate contentKey="letslinkApp.product.sellerProfile">Seller Profile</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {productList.map((product, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/product/${product.id}`} color="link" size="sm">
                      {product.id}
                    </Button>
                  </td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>
                    {product.picture ? (
                      <div>
                        {product.pictureContentType ? (
                          <a onClick={openFile(product.pictureContentType, product.picture)}>
                            <img
                              alt="seller profile picture"
                              src={`data:${product.pictureContentType};base64,${product.picture}`}
                              style={{ maxHeight: '30px' }}
                            />
                            &nbsp;
                          </a>
                        ) : null}
                        <span>
                          {product.pictureContentType}, {byteSize(product.picture)}
                        </span>
                      </div>
                    ) : null}
                  </td>
                  <td>
                    <Translate contentKey={`letslinkApp.ProductCategory.${product.productCategory}`} />
                  </td>
                  <td>{product.price}</td>
                  <td>
                    {product.file ? (
                      <div>
                        {product.fileContentType ? (
                          <a onClick={openFile(product.fileContentType, product.file)}>
                            <Translate contentKey="entity.action.open">Open</Translate>
                            &nbsp;
                          </a>
                        ) : null}
                        <span>
                          {product.fileContentType}, {byteSize(product.file)}
                        </span>
                      </div>
                    ) : null}
                  </td>
                  <td>
                    {product.sellerProfile ? (
                      <Link to={`/seller-profile/${product.sellerProfile.id}`}>{product.sellerProfile.artistName}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/product/${product.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/product/${product.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/product/${product.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="letslinkApp.product.home.notFound">No Products found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Product;
