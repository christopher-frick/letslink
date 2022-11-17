import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AUTHORITIES } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './seller-profile.reducer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import Product from 'app/entities/product/product';

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

  return (
    <Row>
      <Col>
        <Card className="card text-white bg-dark mb-3">
          <Card className="card-header text-center align-content-center">
            <SellerProfilePicture sellerProfileEntity={sellerProfileEntity} />
            <ButtonGroupEditDelete
              sellerProfile={sellerProfileEntity}
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              account={account}
            />
          </Card>
          <SellerProfileDetails sellerProfileEntity={sellerProfileEntity} />
          <p>{'www.letlink.ch/to/' + sellerProfileEntity.id}</p>
        </Card>
        <Product sellerProfileEntity={sellerProfileEntity} />
      </Col>
    </Row>
  );
};

const ButtonGroupEditDelete = ({ sellerProfile, isAdmin, account, isAuthenticated }) => {
  return (
    isAuthenticated && (
      <div className="btn-group flex-btn-group-container">
        {(isAdmin || sellerProfile.user?.id === account?.id) && (
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
    )
  );
};
const SellerProfilePicture = ({ sellerProfileEntity }) => {
  return sellerProfileEntity?.pictureContentType ? (
    <img
      src={`data:${sellerProfileEntity.pictureContentType};base64,${sellerProfileEntity.picture}`}
      className="img-fluid"
      style={{
        maxHeight: 300,
        maxWidth: 300,
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '50%',
      }}
    />
  ) : null;
};

const SellerProfileDetails = ({ sellerProfileEntity }) => {
  return (
    <Card className={'card-body text-white bg-dark mb-3'}>
      <h4 className="card-title text-center">{sellerProfileEntity?.artistName ? sellerProfileEntity.artistName : 'No Artist Name!'}</h4>
      <p className="card-text text-center">{sellerProfileEntity.city + ' / ' + sellerProfileEntity.country}</p>
      <p className="card-text">{sellerProfileEntity?.description ? sellerProfileEntity.description : 'No description!'}</p>
    </Card>
  );
};
export default SellerProfileDetail;
