import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Col, Row, Table } from 'reactstrap';
import { byteSize, openFile, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AUTHORITIES } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities } from './seller-profile.reducer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';

export const SellerProfile = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

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

export const SellerProfileAdmin = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const sellerProfileList = useAppSelector(state => state.sellerProfile.entities);
  const loading = useAppSelector(state => state.sellerProfile.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
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
          <Link to="/seller-profile/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="letslinkApp.sellerProfile.home.createLabel">Create new Seller Profile</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {sellerProfileList && sellerProfileList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="letslinkApp.sellerProfile.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="letslinkApp.sellerProfile.firstName">First Name</Translate>
                </th>
                <th>
                  <Translate contentKey="letslinkApp.sellerProfile.lastName">Last Name</Translate>
                </th>
                <th>
                  <Translate contentKey="letslinkApp.sellerProfile.stripeAccountId">Stripe Account Id</Translate>
                </th>
                <th>
                  <Translate contentKey="letslinkApp.sellerProfile.artistName">Artist Name</Translate>
                </th>
                <th>
                  <Translate contentKey="letslinkApp.sellerProfile.picture">Picture</Translate>
                </th>
                <th>
                  <Translate contentKey="letslinkApp.sellerProfile.description">Description</Translate>
                </th>
                <th>
                  <Translate contentKey="letslinkApp.sellerProfile.email">Email</Translate>
                </th>
                <th>
                  <Translate contentKey="letslinkApp.sellerProfile.phone">Phone</Translate>
                </th>
                <th>
                  <Translate contentKey="letslinkApp.sellerProfile.city">City</Translate>
                </th>
                <th>
                  <Translate contentKey="letslinkApp.sellerProfile.country">Country</Translate>
                </th>
                <th>
                  <Translate contentKey="letslinkApp.sellerProfile.user">User</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {sellerProfileList.map((sellerProfile, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/seller-profile/${sellerProfile.id}`} color="link" size="sm">
                      {sellerProfile.id}
                    </Button>
                  </td>
                  <td>{sellerProfile.firstName}</td>
                  <td>{sellerProfile.lastName}</td>
                  <td>{sellerProfile.stripeAccountId}</td>
                  <td>{sellerProfile.artistName}</td>
                  <td>
                    {sellerProfile.picture ? (
                      <div>
                        {sellerProfile.pictureContentType ? (
                          <a onClick={openFile(sellerProfile.pictureContentType, sellerProfile.picture)}>
                            <img
                              src={`data:${sellerProfile.pictureContentType};base64,${sellerProfile.picture}`}
                              style={{ maxHeight: '30px' }}
                            />
                            &nbsp;
                          </a>
                        ) : null}
                        <span>
                          {sellerProfile.pictureContentType}, {byteSize(sellerProfile.picture)}
                        </span>
                      </div>
                    ) : null}
                  </td>
                  <td>{sellerProfile.description}</td>
                  <td>{sellerProfile.email}</td>
                  <td>{sellerProfile.phone}</td>
                  <td>
                    <Translate contentKey={`letslinkApp.City.${sellerProfile.city}`} />
                  </td>
                  <td>
                    <Translate contentKey={`letslinkApp.Country.${sellerProfile.country}`} />
                  </td>
                  <td>{sellerProfile.user ? sellerProfile.user.login : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/seller-profile/${sellerProfile.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/seller-profile/${sellerProfile.id}/edit`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/seller-profile/${sellerProfile.id}/delete`}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
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
              <Translate contentKey="letslinkApp.sellerProfile.home.notFound">No Seller Profiles found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SellerProfile;
