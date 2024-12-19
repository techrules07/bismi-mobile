import React, {createContext, useState, useEffect} from 'react';
import {getAllCartItems} from './yourApiFile'; // Import the API function
import {quantity} from '../Networking/HomePageService';

interface ValueProviders {
  products: any[];
  sliderItems: any[];
  categories: any[];
  productList: any[];
  premiumProducts: any[];
  newArrival: any[];
  cartItems: any[];
  homeItems: any[];
  updateSliderItems: (data: any[]) => void;
  updateCategories: (data: any[]) => void;
  updateProductList: (data: any[]) => void;
  updatePremiumProducts: (data: any[]) => void;
  updateNewArrival: (data: any[]) => void;
  updateHomeItems: (data: any[]) => void;
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  getCartDetails: () => any[];
  fetchCartItems: (requestId: number) => void;
  updateQuantity: (productId: string, increment: boolean) => void; // Unified function
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
  const updateQuantity = updatedCart => {
    setCartItems(updatedCart);
  };
  const updateHomeItems = updateItem => {
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
      }}>
      {children}
    </pContext.Provider>
  );
};

export {pContext, ProductContext};
