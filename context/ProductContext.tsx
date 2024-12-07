import React, { createContext, useState } from "react";


interface ValueProviders {
    products: any[],
    sliderItems: any[],
    categories: any[],
    productList: any[],
    updateSliderItems: (data: any[]) => void,
    updateCategories: (data: any[]) => void,
    updateProductList: (data: any[]) => void,
}

const pContext = createContext<ValueProviders|null|undefined>(undefined)


const ProductContext: React.FC<{children: React.ReactNode}> = ({children}) => {

    const [products, setProducts] = useState([])
    const [sliderItems, setSliderItems] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [productList, setProductList] = useState<any[]>([])


const updateSliderItems = (data: any[]) => {
    setSliderItems(data)
}

const updateCategories = (data: any[]) => {
    setCategories(data)
}

const updateProductList = (data: any[]) => {
    setProductList(data)
}


    return <pContext.Provider value={{ products, sliderItems, updateSliderItems, categories, updateCategories, productList, updateProductList }}>{children}</pContext.Provider>
}


export {pContext, ProductContext}

