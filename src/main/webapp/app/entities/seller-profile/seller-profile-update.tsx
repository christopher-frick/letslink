import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm, ValidatedBlobField } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { ISellerProfile } from 'app/shared/model/seller-profile.model';
import { City } from 'app/shared/model/enumerations/city.model';
import { Country } from 'app/shared/model/enumerations/country.model';
import { getEntity, updateEntity, createEntity, reset } from './seller-profile.reducer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

export const SellerProfileUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const users = useAppSelector(state => state.userManagement.users);
  const account = useAppSelector(state => state.authentication.account);
  const sellerProfileEntity = useAppSelector(state => state.sellerProfile.entity);
  const loading = useAppSelector(state => state.sellerProfile.loading);
  const updating = useAppSelector(state => state.sellerProfile.updating);
  const updateSuccess = useAppSelector(state => state.sellerProfile.updateSuccess);
  const cityValues = Object.keys(City);
  const countryValues = Object.keys(Country);
  const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]));
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const hasAlreadySellerProfile = useAppSelector(state => state.sellerProfile.hasAlreadySellerProfile);
  const handleClose = () => {
    navigate('/seller-profile');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getUsers({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...sellerProfileEntity,
      ...values,
      user: users.find(it => it.id.toString() === values.user.toString()),
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
          city: 'BERN',
          country: 'CH',
          ...sellerProfileEntity,
          user: sellerProfileEntity?.user?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="letslinkApp.sellerProfile.home.createOrEditLabel" data-cy="SellerProfileCreateUpdateHeading">
            <Translate contentKey="letslinkApp.sellerProfile.home.createOrEditLabel">Create or edit a SellerProfile</Translate>
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
                  id="seller-profile-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('letslinkApp.sellerProfile.firstName')}
                id="seller-profile-firstName"
                name="firstName"
                data-cy="firstName"
                type="text"
              />
              <ValidatedField
                label={translate('letslinkApp.sellerProfile.lastName')}
                id="seller-profile-lastName"
                name="lastName"
                data-cy="lastName"
                type="text"
              />
              <ValidatedField
                label={translate('letslinkApp.sellerProfile.stripeAccountId')}
                id="seller-profile-stripeAccountId"
                name="stripeAccountId"
                data-cy="stripeAccountId"
                type="text"
              />
              <ValidatedField
                label={translate('letslinkApp.sellerProfile.artistName')}
                id="seller-profile-artistName"
                name="artistName"
                data-cy="artistName"
                type="text"
              />
              <ValidatedBlobField
                label={translate('letslinkApp.sellerProfile.picture')}
                id="seller-profile-picture"
                name="picture"
                data-cy="picture"
                isImage
                accept="image/*"
              />
              <ValidatedField
                label={translate('letslinkApp.sellerProfile.description')}
                id="seller-profile-description"
                name="description"
                data-cy="description"
                type="text"
              />
              <ValidatedField
                label={translate('letslinkApp.sellerProfile.email')}
                id="seller-profile-email"
                name="email"
                data-cy="email"
                type="text"
                validate={{
                  pattern: {
                    value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                    message: translate('entity.validation.pattern', { pattern: '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$' }),
                  },
                  required: {
                    message: 'Please enter your email address',
                    value: true,
                  },
                }}
              />
              <ValidatedField
                label={translate('letslinkApp.sellerProfile.phone')}
                id="seller-profile-phone"
                name="phone"
                data-cy="phone"
                type="text"
              />
              <ValidatedField
                label={translate('letslinkApp.sellerProfile.city')}
                id="seller-profile-city"
                name="city"
                data-cy="city"
                type="select"
              >
                {cityValues.map(city => (
                  <option value={city} key={city}>
                    {translate('letslinkApp.City.' + city)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('letslinkApp.sellerProfile.country')}
                id="seller-profile-country"
                name="country"
                data-cy="country"
                type="select"
              >
                {countryValues.map(country => (
                  <option value={country} key={country}>
                    {translate('letslinkApp.Country.' + country)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                id="seller-profile-user"
                name="user"
                data-cy="user"
                label={translate('letslinkApp.sellerProfile.user')}
                type="select"
                /*disabled={isAdmin ? false : true}*/
              >
                {
                  // isauthenticated is used to prevent the user from seeing the user field when he is not logged in
                  isAuthenticated &&
                    // if the user is logged in has admin rights, he can see all users
                    (isAdmin
                      ? users &&
                        users.length > 0 &&
                        users.map(user => (
                          <option value={user.id} key={user.id}>
                            {user.login}
                          </option>
                        ))
                      : // if the user is logged in but has no admin rights, he can only see his own user
                        users &&
                        users.length > 0 &&
                        users
                          .filter(user => user.id === account.id)
                          .map(user => (
                            <option value={user.id} key={user.id}>
                              {user.login}
                            </option>
                          )))
                }
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/seller-profile" replace color="info">
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

export default SellerProfileUpdate;
