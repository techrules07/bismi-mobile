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
export const applyCoupons = async ({couponCode, purchaseAmount}) => {
  try {
    const response = await AxiosConfig.post('coupons/applyCoupon', {
      couponCode,
      purchaseAmount,
    });
    console.log('Coupons applied successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error applying coupons:', error);
    throw error;
  }
};
export const updateCoupons = async ({requestUserId, requestCouponCode}) => {
  try {
    const response = await AxiosConfig.post('coupons/appliedCoupons', {
      requestUserId,
      requestCouponCode,
    });
    console.log('Coupons updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error applying coupons:', error);
    throw error;
  }
};
