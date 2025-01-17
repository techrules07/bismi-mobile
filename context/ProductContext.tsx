//@ts-nocheck
import React, {createContext, useState, useEffect} from 'react';
import {
  getAllCartItems,
  getSearchProducts,
  getAllFavorite,
  addFavorite,
  deleteFavorite,
  getProductRating,
  addProductRating,
  editProductRating,
  deleteProductRating,
  getAllProducts,
} from '../Networking/HomePageService';
import Snackbar from 'react-native-snackbar';

interface ValueProviders {
  products: any[];
  sliderItems: any[];
  categories: any[];
  productList: any[];
  premiumProducts: any[];
  newArrival: any[];
  cartItems: any[];
  homeItems: any[];
  searchResults: any[];
  favoriteItems: any[];
  updateSliderItems: (data: any[]) => void;
  updateCategories: (data: any[]) => void;
  updateProductList: (data: any[]) => void;
  updatePremiumProducts: (data: any[]) => void;
  updateNewArrival: (data: any[]) => void;
  updateHomeItems: (data: any[]) => void;
  updateSearchResults: (data: any[]) => void;
  searchProducts: (query: string) => Promise<void>;
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  getCartDetails: () => any[];
  fetchCartItems: (requestId: number) => void;
  updateQuantity: (productId: string, increment: boolean) => void;
  fetchFavoriteItems: (requestId: number) => void;
  addToFavorite: (product: any) => void;
  removeFromFavorite: (productId: string) => void;
  fetchRatings: (requestId: string, userId: string) => Promise<void>;
  addRating: (ratingData: any) => Promise<void>;
  editRating: (ratingData: any) => Promise<void>;
  deleteRating: (ratingId: string) => Promise<void>;
  placeOrder: (data: any) => Promise<void>;
}

const pContext = createContext<ValueProviders | null | undefined>(undefined);

const ProductContext: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [sliderItems, setSliderItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [productList, setProductList] = useState<any[]>([]);
  const [premiumProducts, setPremiumProducts] = useState<any[]>([]);
  const [newArrival, setNewArrival] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [homeItems, setHomeItems] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<any[]>([]);
  const [ratings, setRatings] = useState([]);
  const [placeOrders, setPlaceOrder] = useState([]);
  const fetchCartItems = async (requestId: number) => {
    try {
      const response = await getAllCartItems(requestId);
      if (response) {
        setCartItems(response);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const fetchFavoriteItems = async (requestId: number) => {
    try {
      const response = await getAllFavorite(requestId);
      if (response) {
        setFavoriteItems(response);
      }
    } catch (error) {
      console.error('Error fetching favorite items:', error);
    }
  };

  const searchProducts = async (query: string) => {
    try {
      const response = await getSearchProducts(query);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const fetchRatings = async (requestId: any, userId: any) => {
    try {
      let payload = {
        requestId: requestId,
        userId: userId,
      };
      const ratingsResponse = await getProductRating(payload);
      const ratingsArray = ratingsResponse?.data?.ratings;
      if (Array.isArray(ratingsArray)) {
        let ratings_array =
          Array.isArray(ratingsArray) && ratingsArray.length > 0
            ? ratingsArray
            : [];
        //@ts-ignore
        setRatings(ratings_array);
        return true;
      } else {
        console.warn(
          'Unexpected data format, resetting to empty array:',
          ratingsArray,
        );
        setRatings([]);
        return true;
      }
    } catch (error) {
      setRatings([]);
      console.log('Error at fetchRatings');
      return true;
    }
  };

  const addRating = (ratingData: any) => {
    setRatings(prevRatings => {
      return [...prevRatings, ratingData];
    });
  };

  const editRating = async (ratingData: any) => {
    try {
      const response = await editProductRating(ratingData);
      if (response) {
        setRatings(prevRatings =>
          prevRatings.map(rating =>
            rating.id === response.id ? response : rating,
          ),
        );
        // Snackbar.show({
        //   text: 'Rating updated successfully!',
        //   duration: Snackbar.LENGTH_LONG,
        //   backgroundColor: 'green',
        // });
      }
    } catch (error) {
      console.error('Error editing rating:', error);
      // Snackbar.show({
      //   text: `Failed to edit rating: ${error.message}`,
      //   duration: Snackbar.LENGTH_LONG,
      //   backgroundColor: 'red',
      // });
    }
  };

  const deleteRating = async (ratingId: string) => {
    try {
      const response = await deleteProductRating({ratingId});
      if (response) {
        setRatings(prevRatings =>
          prevRatings.filter(rating => rating.id !== ratingId),
        );
        // Snackbar.show({
        //   text: 'Rating deleted successfully!',
        //   duration: Snackbar.LENGTH_LONG,
        //   backgroundColor: 'green',
        // });
      }
    } catch (error) {
      console.error('Error deleting rating:', error);
      // Snackbar.show({
      //   text: `Failed to delete rating: ${error.message}`,
      //   duration: Snackbar.LENGTH_LONG,
      //   backgroundColor: 'red',
      // });
    }
  };

  const updateSearchResults = (data: any[]) => {
    setSearchResults(data);
  };

  const updateQuantity = (updatedCart: any[]) => {
    setCartItems(updatedCart);
  };

  const updateHomeItems = (updateItem: any[]) => {
    setHomeItems(updateItem);
  };

  const updateSliderItems = (data: any[]) => {
    setSliderItems(data);
  };

  const updateCategories = (data: any[]) => {
    setCategories(data);
  };

  const updateProductList = (data: any[]) => {
    setProductList(data);
  };

  const updatePremiumProducts = (data: any[]) => {
    setPremiumProducts(data);
  };

  const updateNewArrival = (data: any[]) => {
    setNewArrival(data);
  };
  const placeOrder = (data: any[]) => {
    setPlaceOrder(data);
  };
  const addToCart = (product: any) => {
    setCartItems(prevItems => {
      const itemExists = prevItems.find(item => item.id === product.id);
      if (itemExists) {
        return prevItems.map(item =>
          item.id === product.id
            ? {...item, quantity: item.quantity + 1}
            : item,
        );
      } else {
        return [...prevItems, {...product, quantity: 1}];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const getCartDetails = () => {
    return cartItems;
  };

  const addToFavorite = async (product: any) => {
    try {
      const response = await addFavorite(product);

      if (response && response.status === 'Success') {
        // Snackbar.show({
        //   text: 'Product added to favorites successfully!',
        //   duration: Snackbar.LENGTH_LONG,
        //   backgroundColor: 'green',
        // });
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      // Snackbar.show({
      //   text: `Failed to add to favorites: ${error.message}`,
      //   duration: Snackbar.LENGTH_LONG,
      //   backgroundColor: 'red',
      // });
      return false;
    }
  };

  const removeFromFavorite = async (productId: string) => {
    try {
      const response = await deleteFavorite(productId);
      if (response?.status === 'Success') {
        // Snackbar.show({
        //   text: 'Product removed from favorites successfully!',
        //   duration: Snackbar.LENGTH_LONG,
        //   backgroundColor: 'green',
        // });
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      // Snackbar.show({
      //   text: `Failed to remove from favorites: ${error?.message}`,
      //   duration: Snackbar.LENGTH_LONG,
      //   backgroundColor: 'red',
      // });
      return false;
    }
  };

  return (
    <pContext.Provider
      value={{
        products,
        sliderItems,
        updateSliderItems,
        categories,
        updateCategories,
        productList,
        updateProductList,
        premiumProducts,
        updatePremiumProducts,
        cartItems,
        newArrival,
        addToCart,
        removeFromCart,
        getCartDetails,
        fetchCartItems,
        updateNewArrival,
        updateQuantity,
        updateHomeItems,
        homeItems,
        searchResults,
        updateSearchResults,
        searchProducts,
        favoriteItems,
        fetchFavoriteItems,
        addToFavorite,
        removeFromFavorite,
        ratings,
        fetchRatings,
        addRating,
        editRating,
        deleteRating,
        setRatings,
        placeOrder,
        placeOrders,
      }}>
      {children}
    </pContext.Provider>
  );
};

export {pContext, ProductContext};
