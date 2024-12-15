import axios from "axios";
import { AxiosConfig } from "../../Networking/AxiosConfig";


const getAllOffers = async() => {
    try {
        const {data} = await AxiosConfig.post('/offers/getOffers');
        return data;
    } catch (error) {
        console.log("Error in getAllOffers")
    }
  };
  
  const getAllCategories = async () => {
    try {
      const { data } = await AxiosConfig.get('/products/get/get-categories');
      return data;
    } catch (error) {
      console.error("Error in getAllCategories", error);
    }
  };
  
  const getAllProducts = async (id: any) => {
    try {
      const { data } = await AxiosConfig.post('products/get/all-products', {
        categoryId: id,
      });
      return data;
    } catch (error) {
      console.error("Error in getAllProducts", error);
    }
  };


  const ProductAdapter = {
    getAllOffers,
    getAllCategories,
    getAllProducts
  }

  export default ProductAdapter;