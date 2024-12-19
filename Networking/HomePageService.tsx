import {AxiosConfig} from './AxiosConfig';

export const getAllOffers = () => {
  return AxiosConfig.post('/offers/getOffers');
};

export const getAllCategories = () => {
  return AxiosConfig.get('/products/get/get-categories');
};
export const getHomePage = (requestData: any) => {
  return AxiosConfig.get('products/get/get-homepage', requestData);
};

export const getAllProducts = (id: any) => {
  return AxiosConfig.post('products/get/all-products', {
    categoryId: id,
  });
};
export const getAllPremiumProducts = () => {
  return AxiosConfig.post('products/getPremiumProducts');
};
export const getNewArrivalProducts = () => {
  return AxiosConfig.post('products/getNewArrivalProducts');
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
export const quantity = (requestId: number) => {
  return AxiosConfig.post('cart/changeQuantity', requestId)
    .then(response => {
      console.log('quantity changed:', response?.data);
      return response.data;
    })
    .catch(error => {
      console.error('Error in quantity change:', error);
      throw error;
    });
};
export const getDetails = (requestId: number, userId: number) => {
  const requestData = {
    requestId,
    userId,
  };

  return AxiosConfig.post('products/get/get-details', requestData)
    .then(response => {
      console.log('Product details retrieved:', response?.data);
      return response.data;
    })
    .catch(error => {
      console.error('Error retrieving product details:', error);
      throw error;
    });
};
export const getAllCartItems = (requestId: number) => {
  const requestData = {
    requestId,
  };

  return AxiosConfig.post('cart/getAllItems', requestData)
    .then(response => {
      console.log('List of all cart Items:', response?.data);
      return response.data;
    })
    .catch(error => {
      console.error('Error retrieving cart list:', error);
      throw error;
    });
};
