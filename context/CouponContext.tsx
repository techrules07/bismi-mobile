import React, {createContext, useState, useContext} from 'react';
import {getAllCoupons} from '../Networking/CouponPageService';

const CouponContext = createContext();

export const CouponProvider = ({children}) => {
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const fetchCoupons = async () => {
    try {
      const response = await getAllCoupons();
      if (response) {
        setCoupons(response);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const applyCoupon = couponCode => {
    const coupon = coupons.find(coupon => coupon.code === couponCode);
    if (coupon) {
      setAppliedCoupon(coupon);
    } else {
      console.log('Invalid coupon');
    }
  };

  const value = {
    coupons,
    appliedCoupon,
    fetchCoupons,
    applyCoupon,
  };

  return (
    <CouponContext.Provider value={value}>{children}</CouponContext.Provider>
  );
};

export const useCoupons = () => useContext(CouponContext);
