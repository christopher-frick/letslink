import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import SellerProfile from './seller-profile';
import Product from './product';
import ProjectLink from './project-link';
/* jhipster-needle-add-route-import - JHipster will add routes here */

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <Route path="seller-profile/*" element={<SellerProfile />} />
        <Route path="product/*" element={<Product />} />
        <Route path="project-link/*" element={<ProjectLink />} />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
