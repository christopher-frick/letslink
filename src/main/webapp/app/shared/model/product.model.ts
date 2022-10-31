import { ISellerProfile } from 'app/shared/model/seller-profile.model';
import { ProductCategory } from 'app/shared/model/enumerations/product-category.model';

export interface IProduct {
  id?: number;
  name?: string | null;
  description?: string | null;
  pictureContentType?: string | null;
  picture?: string | null;
  productCategory?: ProductCategory | null;
  price?: number | null;
  fileContentType?: string | null;
  file?: string | null;
  sellerProfile?: ISellerProfile | null;
}

export const defaultValue: Readonly<IProduct> = {};
