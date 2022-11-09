import { IUser } from 'app/shared/model/user.model';
import { IProduct } from 'app/shared/model/product.model';
import { IProjectLink } from 'app/shared/model/project-link.model';
import { City } from 'app/shared/model/enumerations/city.model';
import { Country } from 'app/shared/model/enumerations/country.model';

export interface ISellerProfile {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
  stripeAccountId?: string | null;
  artistName?: string | null;
  pictureContentType?: string | null;
  picture?: string | null;
  description?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: City | null;
  country?: Country | null;
  user?: IUser | null;
  products?: IProduct[] | null;
  projectLinks?: IProjectLink[] | null;
}

export const defaultValue: Readonly<ISellerProfile> = {};
