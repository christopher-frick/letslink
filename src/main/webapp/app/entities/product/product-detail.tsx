import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, openFile, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './product.reducer';

export const ProductDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const productEntity = useAppSelector(state => state.product.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="productDetailsHeading">
          <Translate contentKey="letslinkApp.product.detail.title">Product</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{productEntity.id}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="letslinkApp.product.name">Name</Translate>
            </span>
          </dt>
          <dd>{productEntity.name}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="letslinkApp.product.description">Description</Translate>
            </span>
          </dt>
          <dd>{productEntity.description}</dd>
          <dt>
            <span id="picture">
              <Translate contentKey="letslinkApp.product.picture">Picture</Translate>
            </span>
          </dt>
          <dd>
            {productEntity.picture ? (
              <div>
                {productEntity.pictureContentType ? (
                  <a onClick={openFile(productEntity.pictureContentType, productEntity.picture)}>
                    <img src={`data:${productEntity.pictureContentType};base64,${productEntity.picture}`} style={{ maxHeight: '30px' }} />
                  </a>
                ) : null}
                <span>
                  {productEntity.pictureContentType}, {byteSize(productEntity.picture)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>
            <span id="productCategory">
              <Translate contentKey="letslinkApp.product.productCategory">Product Category</Translate>
            </span>
          </dt>
          <dd>{productEntity.productCategory}</dd>
          <dt>
            <span id="price">
              <Translate contentKey="letslinkApp.product.price">Price</Translate>
            </span>
          </dt>
          <dd>{productEntity.price}</dd>
          <dt>
            <span id="file">
              <Translate contentKey="letslinkApp.product.file">File</Translate>
            </span>
          </dt>
          <dd>
            {productEntity.file ? (
              <div>
                {productEntity.fileContentType ? (
                  <a onClick={openFile(productEntity.fileContentType, productEntity.file)}>
                    <Translate contentKey="entity.action.open">Open</Translate>&nbsp;
                  </a>
                ) : null}
                <span>
                  {productEntity.fileContentType}, {byteSize(productEntity.file)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>
            <Translate contentKey="letslinkApp.product.sellerProfile">Seller Profile</Translate>
          </dt>
          <dd>{productEntity.sellerProfile ? productEntity.sellerProfile.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/product" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/product/${productEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ProductDetail;
