import {AxiosConfig} from './AxiosConfig';

export const getAllCoupons = () => {
  return AxiosConfig.post('coupons/getAllCoupons')
    .then(response => {
      console.log('Coupons get successfully:', response.data);
      return response.data;
    })

    .catch(error => {
      console.error('Error in getting Coupons:', error);
      throw error;
    });
};
