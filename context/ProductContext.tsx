import React, {createContext, useState} from 'react';

interface ValueProviders {
  products: any[];
  sliderItems: any[];
  categories: any[];
  productList: any[];
  premiumProducts: any[];
  cartItems: any[]; // Added cartItems to the context
  updateSliderItems: (data: any[]) => void;
  updateCategories: (data: any[]) => void;
  updateProductList: (data: any[]) => void;
  updatePremiumProducts: (data: any[]) => void;
  addToCart: (product: any) => void; // Function to add item to cart
  removeFromCart: (productId: string) => void; // Function to remove item from cart
  getCartDetails: () => any[]; // Function to get cart details
}

const pContext = createContext<ValueProviders | null | undefined>(undefined);

const ProductContext: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [sliderItems, setSliderItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [productList, setProductList] = useState<any[]>([]);
  const [premiumProducts, setPremiumProducts] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]); // Added cartItems state

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
        addToCart,
        removeFromCart,
        getCartDetails,
      }}>
      {children}
    </pContext.Provider>
  );
};

export {pContext, ProductContext};
