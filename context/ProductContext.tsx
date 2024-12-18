import React, {createContext, useState} from 'react';

interface ValueProviders {
  products: any[];
  sliderItems: any[];
  categories: any[];
  productList: any[];
  premiumProducts: any[]; // Added premiumProducts
  updateSliderItems: (data: any[]) => void;
  updateCategories: (data: any[]) => void;
  updateProductList: (data: any[]) => void;
  updatePremiumProducts: (data: any[]) => void; // Added updatePremiumProducts
}

const pContext = createContext<ValueProviders | null | undefined>(undefined);

const ProductContext: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [sliderItems, setSliderItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [productList, setProductList] = useState<any[]>([]);
  const [premiumProducts, setPremiumProducts] = useState<any[]>([]); // Added premiumProducts state

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
    setPremiumProducts(data); // Added updatePremiumProducts function
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
        premiumProducts, // Added premiumProducts to context value
        updatePremiumProducts, // Added updatePremiumProducts to context value
      }}>
      {children}
    </pContext.Provider>
  );
};

export {pContext, ProductContext};
