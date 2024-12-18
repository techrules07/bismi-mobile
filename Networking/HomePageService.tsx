import {AxiosConfig} from './AxiosConfig';

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
export const getAllPremiumProducts = () => {
  return AxiosConfig.post('products/getPremiumProducts');
};
