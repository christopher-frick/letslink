import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IProjectLink } from 'app/shared/model/project-link.model';
import { getEntities } from './project-link.reducer';

export const ProjectLink = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const projectLinkList = useAppSelector(state => state.projectLink.entities);
  const loading = useAppSelector(state => state.projectLink.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  return (
    <div>
      <h2 id="project-link-heading" data-cy="ProjectLinkHeading">
        <Translate contentKey="letslinkApp.projectLink.home.title">Project Links</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="letslinkApp.projectLink.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/project-link/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="letslinkApp.projectLink.home.createLabel">Create new Project Link</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {projectLinkList && projectLinkList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="letslinkApp.projectLink.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="letslinkApp.projectLink.name">Name</Translate>
                </th>
                <th>
                  <Translate contentKey="letslinkApp.projectLink.url">Url</Translate>
                </th>
                <th>
                  <Translate contentKey="letslinkApp.projectLink.sellerProfile">Seller Profile</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {projectLinkList.map((projectLink, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/project-link/${projectLink.id}`} color="link" size="sm">
                      {projectLink.id}
                    </Button>
                  </td>
                  <td>{projectLink.name}</td>
                  <td>{projectLink.url}</td>
                  <td>
                    {projectLink.sellerProfile ? (
                      <Link to={`/seller-profile/${projectLink.sellerProfile.id}`}>{projectLink.sellerProfile.id}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/project-link/${projectLink.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/project-link/${projectLink.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/project-link/${projectLink.id}/delete`}
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
              <Translate contentKey="letslinkApp.projectLink.home.notFound">No Project Links found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProjectLink;
