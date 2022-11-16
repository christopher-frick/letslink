import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AUTHORITIES } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities } from './seller-profile.reducer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';

export const SellerProfile = () => {
  const dispatch = useAppDispatch();

  const account = useAppSelector(state => state.authentication.account);

  const sellerProfileList = useAppSelector(state => state.sellerProfile.entities);
  const loading = useAppSelector(state => state.sellerProfile.loading);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]));

  const sellerProfileId = sellerProfileList.find(sellerProfile => sellerProfile.user?.id === account?.id)?.id;

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  return (
    <div>
      <h2 id="seller-profile-heading" data-cy="SellerProfileHeading">
        <Translate contentKey="letslinkApp.sellerProfile.home.title">Profiles</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="letslinkApp.sellerProfile.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <ButtonCreateSellerProfile sellerProfileId={sellerProfileId} isAdmin={isAdmin} isAuthenticated={isAuthenticated} />
        </div>
      </h2>
      {sellerProfileList && sellerProfileList.length > 0 ? (
        <Row>
          {sellerProfileList.map((sellerProfile, i) => (
            <Col lg="6" key={`entity-${i}`}>
              <Card className="text-white bg-dark mb-3">
                <CardHeader sellerProfile={sellerProfile} />
                <CardBody sellerProfile={sellerProfile} />
                {isAuthenticated && (
                  <CardEditDeleteButtons
                    sellerProfile={sellerProfile}
                    isAuthenticated={isAuthenticated}
                    isAdmin={isAdmin}
                    account={account}
                  />
                )}
              </Card>
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

const CardHeader = ({ sellerProfile }) => {
  return (
    <Card tag={Link} to={`${sellerProfile.id}`} className="card-header text-center">
      {sellerProfile?.pictureContentType ? (
        <img src={`data:${sellerProfile.pictureContentType};base64,${sellerProfile.picture}`} className="img-fluid" />
      ) : null}
    </Card>
  );
};
const CardBody = ({ sellerProfile }) => {
  return (
    <Card tag={Link} to={`${sellerProfile.id}`} className="card-body text-white bg-dark mb-3">
      <h4 className="card-title text-center">{sellerProfile?.artistName ? sellerProfile.artistName : 'No Artist Name!'}</h4>
      <p className="card-text">{sellerProfile?.description ? sellerProfile.description : 'No description!'}</p>
    </Card>
  );
};

const CardEditDeleteButtons = ({ sellerProfile, isAdmin, isAuthenticated, account }) => {
  return (
    isAuthenticated && (
      <div className="card-footer">
        <div className="btn-group flex-btn-group-container">
          {isAuthenticated && (isAdmin || sellerProfile.user?.id === account?.id) && (
            <Button
              tag={Link}
              to={`/seller-profile/${sellerProfile.id}/edit`}
              color="primary"
              data-cy="entityEditButton"
              id="jh-edit-entity"
            >
              <FontAwesomeIcon icon="pencil-alt" />
              <span className="d-none d-md-inline">
                <Translate contentKey="entity.action.edit">Edit</Translate>
              </span>
            </Button>
          )}
          {isAuthenticated &&
            ((isAdmin && (
              <Button
                tag={Link}
                to={`/seller-profile/${sellerProfile.id}/delete`}
                color="danger"
                data-cy="entityDeleteButton"
                id="jh-delete-entity"
              >
                <FontAwesomeIcon icon="trash" />{' '}
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.delete">Delete</Translate>
                </span>
              </Button>
            )) ||
              (sellerProfile.user?.id === account?.id && (
                <Button
                  tag={Link}
                  to={`/seller-profile/${sellerProfile.id}/delete`}
                  color="danger"
                  data-cy="entityDeleteButton"
                  id="jh-delete-entity"
                >
                  <FontAwesomeIcon icon="trash" />{' '}
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.delete">Delete</Translate>
                  </span>
                </Button>
              )))}
        </div>
      </div>
    )
  );
};
const ButtonCreateSellerProfile = ({ isAdmin, isAuthenticated, sellerProfileId }) => {
  return (
    (isAuthenticated && isAdmin && (
      <Link to="/seller-profile/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
        <FontAwesomeIcon icon="plus" />
        &nbsp;
        <Translate contentKey="letslinkApp.sellerProfile.home.createLabel">Create new Seller Profile</Translate>
      </Link>
    )) ||
    (sellerProfileId !== undefined && (
      <Link
        to={`/seller-profile/${sellerProfileId}/edit`}
        color="primary"
        data-cy="entityEditButton"
        className="btn btn-primary jh-create-entity"
      >
        <FontAwesomeIcon icon="pencil-alt" />{' '}
        <span className="d-none d-md-inline">
          <Translate contentKey="letslinkApp.sellerProfile.home.createOrEditLabel">Create or edit a Seller Profile</Translate>
        </span>
      </Link>
    )) || (
      <Link to="/seller-profile/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
        <FontAwesomeIcon icon="plus" />
        &nbsp;
        <Translate contentKey="letslinkApp.sellerProfile.home.createLabel">Create new Seller Profile</Translate>
      </Link>
    )
  );
};

export default SellerProfile;
