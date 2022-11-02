import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { ISellerProfile } from 'app/shared/model/seller-profile.model';
import { getEntities as getSellerProfiles } from 'app/entities/seller-profile/seller-profile.reducer';
import { IProjectLink } from 'app/shared/model/project-link.model';
import { getEntity, updateEntity, createEntity, reset } from './project-link.reducer';

export const ProjectLinkUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const sellerProfiles = useAppSelector(state => state.sellerProfile.entities);
  const projectLinkEntity = useAppSelector(state => state.projectLink.entity);
  const loading = useAppSelector(state => state.projectLink.loading);
  const updating = useAppSelector(state => state.projectLink.updating);
  const updateSuccess = useAppSelector(state => state.projectLink.updateSuccess);

  const handleClose = () => {
    navigate('/project-link');
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
      ...projectLinkEntity,
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
          ...projectLinkEntity,
          sellerProfile: projectLinkEntity?.sellerProfile?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="letslinkApp.projectLink.home.createOrEditLabel" data-cy="ProjectLinkCreateUpdateHeading">
            <Translate contentKey="letslinkApp.projectLink.home.createOrEditLabel">Create or edit a ProjectLink</Translate>
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
                  id="project-link-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('letslinkApp.projectLink.name')}
                id="project-link-name"
                name="name"
                data-cy="name"
                type="text"
              />
              <ValidatedField label={translate('letslinkApp.projectLink.url')} id="project-link-url" name="url" data-cy="url" type="text" />
              <ValidatedField
                id="project-link-sellerProfile"
                name="sellerProfile"
                data-cy="sellerProfile"
                label={translate('letslinkApp.projectLink.sellerProfile')}
                type="select"
              >
                <option value="" key="0" />
                {sellerProfiles
                  ? sellerProfiles.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.artistName}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/project-link" replace color="info">
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

export default ProjectLinkUpdate;
