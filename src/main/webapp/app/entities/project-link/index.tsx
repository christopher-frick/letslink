import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import ProjectLink from './project-link';
import ProjectLinkDetail from './project-link-detail';
import ProjectLinkUpdate from './project-link-update';
import ProjectLinkDeleteDialog from './project-link-delete-dialog';

const ProjectLinkRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ProjectLink />} />
    <Route path="new" element={<ProjectLinkUpdate />} />
    <Route path=":id">
      <Route index element={<ProjectLinkDetail />} />
      <Route path="edit" element={<ProjectLinkUpdate />} />
      <Route path="delete" element={<ProjectLinkDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ProjectLinkRoutes;
