import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './project-link.reducer';

export const ProjectLinkDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const projectLinkEntity = useAppSelector(state => state.projectLink.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="projectLinkDetailsHeading">
          <Translate contentKey="letslinkApp.projectLink.detail.title">ProjectLink</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{projectLinkEntity.id}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="letslinkApp.projectLink.name">Name</Translate>
            </span>
          </dt>
          <dd>{projectLinkEntity.name}</dd>
          <dt>
            <span id="url">
              <Translate contentKey="letslinkApp.projectLink.url">Url</Translate>
            </span>
          </dt>
          <dd>{projectLinkEntity.url}</dd>
          <dt>
            <Translate contentKey="letslinkApp.projectLink.sellerProfile">Seller Profile</Translate>
          </dt>
          <dd>{projectLinkEntity.sellerProfile ? projectLinkEntity.sellerProfile.artistName : ''}</dd>
        </dl>
        <Button tag={Link} to="/project-link" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/project-link/${projectLinkEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ProjectLinkDetail;
