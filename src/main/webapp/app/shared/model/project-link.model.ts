import { ISellerProfile } from 'app/shared/model/seller-profile.model';

export interface IProjectLink {
  id?: number;
  name?: string | null;
  url?: string | null;
  sellerProfile?: ISellerProfile | null;
}

export const defaultValue: Readonly<IProjectLink> = {};
