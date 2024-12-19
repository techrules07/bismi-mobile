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
export const addToCart = (defaultItems: any) => {
  return AxiosConfig.post('cart/addToCart', defaultItems)
    .then(response => {
      console.log('Item added to cart successfully:', response.data);
      return response.data;
    })

    .catch(error => {
      console.error('Error adding item to cart:', error);
      throw error;
    });
};
export const removeCart = (requestId: number, userId: number) => {
  const requestData = {
    requestId: requestId,
    userId: userId,
  };

  return AxiosConfig.post('cart/removeCart', requestData)
    .then(response => {
      console.log('Item removed from cart successfully:', response?.data);
      return response.data;
    })
    .catch(error => {
      console.error('Error removing item from cart:', error);
      throw error;
    });
};
export const getDetails = () => {
  return AxiosConfig.post('products/get/get-details');
};
