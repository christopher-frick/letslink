import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import SellerProfile from './seller-profile';
import SellerProfileDetail from './seller-profile-detail';
import SellerProfileUpdate from './seller-profile-update';
import SellerProfileDeleteDialog from './seller-profile-delete-dialog';

const SellerProfileRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<SellerProfile />} />
    <Route path="new" element={<SellerProfileUpdate />} />
    <Route path=":id">
      <Route index element={<SellerProfileDetail />} />
      <Route path="edit" element={<SellerProfileUpdate />} />
      <Route path="delete" element={<SellerProfileDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default SellerProfileRoutes;
