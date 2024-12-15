import { useContext } from "react";
import { ProductContext } from "../contexts/product-context";


export function useAllProducts() {
    const context = useContext(ProductContext);
    if(context === undefined){
        throw new Error("Context must be used within a Provider");
    }
    return context;
}