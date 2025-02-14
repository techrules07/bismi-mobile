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

export const getAllProducts = (categoryId: any, userId?: any) => {
  const payload: any = {categoryId};

  if (userId) {
    payload.userId = String(userId);
  }

  return AxiosConfig.post('products/get/all-products', payload);
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
export const getDetails = async (requestId: number, userId: any) => {
  const requestData = {
    requestId,
    userId: userId || 0,
  };

  console.log('Requesting product details with data:', requestData);

  try {
    const response = await AxiosConfig.post(
      'products/get/get-details',
      requestData
    );

    if (response?.status === 200) {
      console.log('Product details retrieved successfully:', response?.data);
      return response.data;
    } else {
      console.error('Unexpected response status:', response?.status);
      throw new Error('Unexpected response from server');
    }
  } catch (error) {
    console.error('Error retrieving product details:', {
      error,
      requestData,
      response: error?.response,
    });
    throw error;
  }
};

export const getAllCartItems = async (requestId: number) => {
  if (!requestId) {
    console.error('Request ID is missing or invalid');
    throw new Error('Request ID is required to fetch cart items');
  }

  const requestData = {
    requestId,
    exclusive: true, // Additional parameter as required
  };

  try {
    const response = await AxiosConfig.post('cart/getAllItems', requestData);

    // Check if the response is valid and indicates success
    if (response?.data?.code === 200 && response?.data?.status === 'Success') {
      console.log('List of all cart Items:', response.data);
      return response.data;
    } 
  } catch (error) {
    // Log and rethrow the error for further handling
    console.error('Error retrieving cart list:', error);
    throw new Error(error?.message || 'An unexpected error occurred while fetching cart items');
  }
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
export const getAllOrders = async (bodyData: any) => {
  try {
    const response = await AxiosConfig.post(
      `/orders/getAllOrders?requestId=${bodyData?.requestId}&userId=${bodyData?.userId}`,
    );

    console.log('Orders retrieved successfully:', response.data);

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
export const getAllOrdersById = async (bodyData: any) => {
  try {
    const response = await AxiosConfig.post(
      `orders/getOrderItems?orderId=${bodyData?.orderId}`,
    );

    console.log('Orders retrieved successfully:', response.data);

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
export const cancelOrderApi = async (bodyData: any) => {
  try {
    const response = await AxiosConfig.post('orders/cancelOrder', bodyData);
    console.log('Order cancelled successfully:', response.data);

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
