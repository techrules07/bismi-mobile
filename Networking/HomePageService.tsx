import {AxiosConfig} from './AxiosConfig';
interface UserLoginRequest {
  id: number;
  name: string;
  phone: string;
  email: string;
  otp: string;
}
export const getAllOffers = () => {
  return AxiosConfig.post('/offers/getOffers');
};

export const getAllCategories = () => {
  return AxiosConfig.get('/products/get/get-categories');
};

export const getAllProducts = (id: any) => {
  return AxiosConfig.post('products/get/all-products', {
    categoryId: id,
  });
};
export const userLogin = (userData: UserLoginRequest) => {
  return AxiosConfig.post('/auth/user/verify-phone', userData);
};
