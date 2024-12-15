import { createContext } from "react";

interface ProductContextType {
    products: any[];
    sliderItems: any[];
    categories: any[];
    productList: any[];
    updateSliderItems: (data: any[]) => void;
    updateCategories: (data: any[]) => void;
    updateProductList: (data: any[]) => void;
}

let defaultProps: ProductContextType = {
    products: [],
    sliderItems: [],
    categories: [],
    productList: [],
    updateSliderItems: (data: any[]) => {},
    updateCategories: (data: any[]) => {},
    updateProductList: (data: any[]) => {},
}

export const ProductContext = createContext(defaultProps)