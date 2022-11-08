import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { openFile, byteSize, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT, AUTHORITIES } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { ISellerProfile } from 'app/shared/model/seller-profile.model';
import { getEntities } from './seller-profile.reducer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { getAccount } from 'app/shared/reducers/authentication';

export const SellerProfile = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();
  const account = useAppSelector(state => state.authentication.account);

  const sellerProfileList = useAppSelector(state => state.sellerProfile.entities);
  const loading = useAppSelector(state => state.sellerProfile.loading);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]));

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

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
    <div>
      <h2 id="seller-profile-heading" data-cy="SellerProfileHeading">
        <Translate contentKey="letslinkApp.sellerProfile.home.title">Seller Profiles</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="letslinkApp.sellerProfile.home.refreshListLabel">Refresh List</Translate>
          </Button>
          {isAuthenticated && (
            <Link to="/seller-profile/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
              <FontAwesomeIcon icon="plus" />
              &nbsp;
              <Translate contentKey="letslinkApp.sellerProfile.home.createLabel">Create new Seller Profile</Translate>
            </Link>
          )}
        </div>
      </h2>
      {sellerProfileList && sellerProfileList.length > 0 ? (
        <Row>
          {sellerProfileList.map((sellerProfile, i) => (
            <Col md="6" tag={Link} to={`/seller-profile/${sellerProfile.id}`}>
              <div className="card text-white bg-dark mb-3" key={`entity-${i}`} data-cy="entityTable">
                <div className="card-header content-center align-content-center">
                  {sellerProfile?.pictureContentType ? (
                    <img src={`data:${sellerProfile.pictureContentType};base64,${sellerProfile.picture}`} style={{ maxHeight: '30px' }} />
                  ) : null}
                </div>
                <div className="card-body">
                  <h4 className="card-title text-center">{sellerProfile?.artistName ? sellerProfile.artistName : 'No Artist Name!'}</h4>
                  <p className="card-text">{sellerProfile?.description ? sellerProfile.description : 'No description!'}</p>
                </div>
                {isAuthenticated && <div className="card-footer">{buttonGroup(sellerProfile)}</div>}
              </div>
            </Col>
          ))}
        </Row>
      ) : (
        !loading && (
          <div className="alert alert-warning">
            <Translate contentKey="letslinkApp.sellerProfile.home.notFound">No Seller Profiles found</Translate>
          </div>
        )
      )}
    </div>
  );
};
export default SellerProfile;
