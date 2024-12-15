import React, {useState} from 'react';
import {ProductContext} from '../contexts/product-context';

const AllProductsContextProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [products, setProducts] = useState([]);
  const [sliderItems, setSliderItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productList, setProductList] = useState([]);
  const updateSliderItems = (data: any) => {
    setSliderItems(data);
  };

  const updateCategories = (data: any) => {
    setCategories(data);
  };

  const updateProductList = (data: any) => {
    setProductList(data);
  };
  return (
    <ProductContext.Provider
      value={{
        products,
        sliderItems,
        updateSliderItems,
        categories,
        updateCategories,
        productList,
        updateProductList,
      }}>
      {children}
    </ProductContext.Provider>
  );
};

export {AllProductsContextProvider};
