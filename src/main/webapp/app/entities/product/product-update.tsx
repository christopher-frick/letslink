import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm, ValidatedBlobField } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { ISellerProfile } from 'app/shared/model/seller-profile.model';
import { getEntities as getSellerProfiles } from 'app/entities/seller-profile/seller-profile.reducer';
import { IProduct } from 'app/shared/model/product.model';
import { ProductCategory } from 'app/shared/model/enumerations/product-category.model';
import { getEntity, updateEntity, createEntity, reset } from './product.reducer';

export const ProductUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const sellerProfiles = useAppSelector(state => state.sellerProfile.entities);
  const productEntity = useAppSelector(state => state.product.entity);
  const loading = useAppSelector(state => state.product.loading);
  const updating = useAppSelector(state => state.product.updating);
  const updateSuccess = useAppSelector(state => state.product.updateSuccess);
  const productCategoryValues = Object.keys(ProductCategory);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const isAdmin = useAppSelector(state => state.authentication.account.authorities.includes('ROLE_ADMIN'));
  const account = useAppSelector(state => state.authentication.account);

  const handleClose = () => {
    navigate('/profiles');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getSellerProfiles({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...productEntity,
      ...values,
      sellerProfile: sellerProfiles.find(it => it.id.toString() === values.sellerProfile.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          productCategory: 'BEAT',
          ...productEntity,
          sellerProfile: productEntity?.sellerProfile?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="letslinkApp.product.home.createOrEditLabel" data-cy="ProductCreateUpdateHeading">
            <Translate contentKey="letslinkApp.product.home.createOrEditLabel">Create or edit a Product</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="product-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField label={translate('letslinkApp.product.name')} id="product-name" name="name" data-cy="name" type="text" />
              <ValidatedField
                label={translate('letslinkApp.product.description')}
                id="product-description"
                name="description"
                data-cy="description"
                type="text"
              />
              <ValidatedBlobField
                label={translate('letslinkApp.product.picture')}
                id="product-picture"
                name="picture"
                data-cy="picture"
                isImage
                accept="image/*"
              />
              <ValidatedField
                label={translate('letslinkApp.product.productCategory')}
                id="product-productCategory"
                name="productCategory"
                data-cy="productCategory"
                type="select"
              >
                {productCategoryValues.map(productCategory => (
                  <option value={productCategory} key={productCategory}>
                    {translate('letslinkApp.ProductCategory.' + productCategory)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('letslinkApp.product.price')}
                id="product-price"
                name="price"
                data-cy="price"
                type="text"
                validate={{
                  min: { value: 0, message: translate('entity.validation.min', { min: 0 }) },
                  validate: v => isNumber(v) || translate('entity.validation.number'),
                }}
              />
              <ValidatedBlobField
                label={translate('letslinkApp.product.file')}
                id="product-file"
                name="file"
                data-cy="file"
                openActionLabel={translate('entity.action.open')}
              />
              <ValidatedField
                id="product-sellerProfile"
                name="sellerProfile"
                data-cy="sellerProfile"
                label={translate('letslinkApp.product.sellerProfile')}
                type="select"
                /*disabled={isAdmin ? false : true}*/
              >
                {
                  // isauthenticated is used to prevent the user from seeing the user field when he is not logged in
                  isAuthenticated &&
                    // if the user is logged in has admin rights, he can see all users
                    (isAdmin
                      ? sellerProfiles &&
                        sellerProfiles.length > 0 &&
                        sellerProfiles.map(sellerProfile => (
                          <option value={sellerProfile.id} key={sellerProfile.id}>
                            {sellerProfile.id} {sellerProfile.artistName}
                          </option>
                        ))
                      : // if the user is logged in but has no admin rights, he can only see his own user
                        sellerProfiles &&
                        sellerProfiles.length > 0 &&
                        sellerProfiles
                          .filter(sellerProfile => sellerProfile.user?.id === account.id)
                          .map(sellerProfile => (
                            <option value={sellerProfile.id} key={sellerProfile.id}>
                              {sellerProfile.id} {sellerProfile.artistName}
                            </option>
                          )))
                }
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/profiles" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProductUpdate;
