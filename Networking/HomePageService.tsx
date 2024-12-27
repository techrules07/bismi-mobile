import {AxiosConfig} from './AxiosConfig';

export const getAllOffers = () => {
  return AxiosConfig.post('/offers/getOffers');
};
export const getSearchProducts = (productSearch: any) => {
  return AxiosConfig.post(
    `products/searchProduct?productSearch=${encodeURIComponent(productSearch)}`,
  );
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
export const getAllFavorite = (requestId: any) => {
  return AxiosConfig.post('favourite/getAllFavourite', requestId)
    .then(response => {
      console.log('List of all favorite Items:', response?.data?.data);
      return response.data;
    })
    .catch(error => {
      console.error('Error retrieving favorite list:', error);
      throw error;
    });
};
export const deleteFavorite = (data: any) => {
  return AxiosConfig.post('favourite/deleteFavourite', data)
    .then(response => {
      console.log('deleted succesfully:', response?.data);
      return response.data;
    })
    .catch(error => {
      console.error('Error in deleting:', error);
      throw error;
    });
};
export const addFavorite = async (bodyData: any) => {
  try {
    const response = await AxiosConfig.post('favourite/addFavourite', bodyData);
    console.log('Favorite item added successfully:', response.data);

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Error in adding favorite:', error);
    throw error;
  }
};
export const addProductRating = async (bodyData: any) => {
  try {
    const response = await AxiosConfig.post(
      'ratings/addProductRating',
      bodyData,
    );
    console.log('Rating added successfully:', response.data);

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Error in adding rating:', error);
    throw error;
  }
};
export const getProductRating = async (bodyData: any) => {
  try {
    const response = await AxiosConfig.post(
      `/ratings/getRatings?requestId=${bodyData?.requestId}&userId=${bodyData?.userId}`,
    );

    console.log('Ratings retrieved successfully:', response.data);

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    if (error.response) {
      console.error('Error in getting rating:', error.response.data);

      console.error('Status code:', error.response.status);
    } else if (error.request) {
      console.error('No response was received:', error.request);
    } else {
      console.error('Error setting up the request:', error.message);
    }
    throw error;
  }
};

export const editProductRating = async (bodyData: any) => {
  try {
    const response = await AxiosConfig.post(
      'ratings/editProductRating',
      bodyData,
    );
    console.log('Rating edited successfully:', response.data);

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Error in editing rating:', error);
    throw error;
  }
};
export const deleteProductRating = async (bodyData: any) => {
  try {
    const response = await AxiosConfig.post(
      'ratings/deleteProductRating',
      bodyData,
    );
    console.log('Rating deleted successfully:', response.data);

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Error in deleting rating:', error);
    throw error;
  }
};
export const placeOrder = async (bodyData: any) => {
  try {
    const response = await AxiosConfig.post('orders/placeOrder', bodyData);
    console.log('Order placed successfully:', response.data);

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Error in deleting rating:', error);
    throw error;
  }
};
