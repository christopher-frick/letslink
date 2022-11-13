import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col, Card } from 'reactstrap';
import { Translate, openFile, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT, AUTHORITIES } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './seller-profile.reducer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { types } from 'sass';
import Color = types.Color;

export const SellerProfileDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const sellerProfileEntity = useAppSelector(state => state.sellerProfile.entity);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]));
  const account = useAppSelector(state => state.authentication.account);

  const buttonGroup = sellerProfile => {
    return (
      <div className="btn-group flex-btn-group-container">
        {isAuthenticated && (isAdmin || sellerProfile.user?.id === account?.id) && (
          <Button tag={Link} to={`/seller-profile/${sellerProfile.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
            <FontAwesomeIcon icon="pencil-alt" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.edit">Edit</Translate>
            </span>
          </Button>
        )}
        {isAuthenticated &&
          ((isAdmin && (
            <Button tag={Link} to={`/seller-profile/${sellerProfile.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
              <FontAwesomeIcon icon="trash" />{' '}
              <span className="d-none d-md-inline">
                <Translate contentKey="entity.action.delete">Delete</Translate>
              </span>
            </Button>
          )) ||
            (sellerProfile.user?.id === account?.id && (
              <Button tag={Link} to={`/seller-profile/${sellerProfile.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
                <FontAwesomeIcon icon="trash" />{' '}
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.delete">Delete</Translate>
                </span>
              </Button>
            )))}
      </div>
    );
  };

  return (
    <Row>
      <Col>
        <div className="card text-white bg-dark mb-3">
          <div className="card-header text-center">
            {isAuthenticated && <div className="card-footer">{buttonGroup(sellerProfileEntity)}</div>}
            {sellerProfileEntity?.pictureContentType ? (
              <img src={`data:${sellerProfileEntity.pictureContentType};base64,${sellerProfileEntity.picture}`} className="img-fluid" />
            ) : null}
          </div>
          <div className="card-body">
            <h4 className="card-title text-center">
              {sellerProfileEntity?.artistName ? sellerProfileEntity.artistName : 'No Artist Name!'}
            </h4>
            <p className="card-text text-center">{sellerProfileEntity.city + ' / ' + sellerProfileEntity.country}</p>
            <p className="card-text">{sellerProfileEntity?.description ? sellerProfileEntity.description : 'No description!'}</p>
          </div>
          <p>{'www.letlink.ch/to/' + sellerProfileEntity.id}</p>
        </div>
      </Col>

      {/* <Col md="8">
        <h2 data-cy="sellerProfileDetailsHeading">
          <Translate contentKey="letslinkApp.sellerProfile.detail.title">SellerProfile</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{sellerProfileEntity.id}</dd>
          <dt>
            <span id="firstName">
              <Translate contentKey="letslinkApp.sellerProfile.firstName">First Name</Translate>
            </span>
          </dt>
          <dd>{sellerProfileEntity.firstName}</dd>
          <dt>
            <span id="lastName">
              <Translate contentKey="letslinkApp.sellerProfile.lastName">Last Name</Translate>
            </span>
          </dt>
          <dd>{sellerProfileEntity.lastName}</dd>
          <dt>
            <span id="stripeAccountId">
              <Translate contentKey="letslinkApp.sellerProfile.stripeAccountId">Stripe Account Id</Translate>
            </span>
          </dt>
          <dd>{sellerProfileEntity.stripeAccountId}</dd>
          <dt>
            <span id="artistName">
              <Translate contentKey="letslinkApp.sellerProfile.artistName">Artist Name</Translate>
            </span>
          </dt>
          <dd>{sellerProfileEntity.artistName}</dd>
          <dt>
            <span id="picture">
              <Translate contentKey="letslinkApp.sellerProfile.picture">Picture</Translate>
            </span>
          </dt>
          <dd>
            {sellerProfileEntity.picture ? (
              <div>
                {sellerProfileEntity.pictureContentType ? (
                  <a onClick={openFile(sellerProfileEntity.pictureContentType, sellerProfileEntity.picture)}>
                    <img
                      src={`data:${sellerProfileEntity.pictureContentType};base64,${sellerProfileEntity.picture}`}
                      style={{ maxHeight: '30px' }}
                    />
                  </a>
                ) : null}
                <span>
                  {sellerProfileEntity.pictureContentType}, {byteSize(sellerProfileEntity.picture)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>
            <span id="description">
              <Translate contentKey="letslinkApp.sellerProfile.description">Description</Translate>
            </span>
          </dt>
          <dd>{sellerProfileEntity.description}</dd>
          <dt>
            <span id="email">
              <Translate contentKey="letslinkApp.sellerProfile.email">Email</Translate>
            </span>
          </dt>
          <dd>{sellerProfileEntity.email}</dd>
          <dt>
            <span id="phone">
              <Translate contentKey="letslinkApp.sellerProfile.phone">Phone</Translate>
            </span>
          </dt>
          <dd>{sellerProfileEntity.phone}</dd>
          <dt>
            <span id="city">
              <Translate contentKey="letslinkApp.sellerProfile.city">City</Translate>
            </span>
          </dt>
          <dd>{sellerProfileEntity.city}</dd>
          <dt>
            <span id="country">
              <Translate contentKey="letslinkApp.sellerProfile.country">Country</Translate>
            </span>
          </dt>
          <dd>{sellerProfileEntity.country}</dd>
          <dt>
            <Translate contentKey="letslinkApp.sellerProfile.user">User</Translate>
          </dt>
          <dd>{sellerProfileEntity.user ? sellerProfileEntity.user.login : ''}</dd>
        </dl>
        <Button tag={Link} to="/seller-profile" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        {isAuthenticated && (isAdmin || sellerProfileEntity.user?.id === account?.id) && (
          <Button tag={Link} to={`/seller-profile/${sellerProfileEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.edit">Edit</Translate>
            </span>
          </Button>
        )}
      </Col>*/}
    </Row>
  );
};

export default SellerProfileDetail;
