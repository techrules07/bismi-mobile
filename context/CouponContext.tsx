import React, { createContext, useState, useContext } from 'react';
import { getAllCoupons } from '../Networking/CouponPageService';

const CouponContext = createContext();

export const CouponProvider = ({ children }) => {
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await getAllCoupons();
      if (response) {
        setCoupons(response);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = ({ couponCode, purchaseAmount }) => {
    if (!couponCode || !Number.isFinite(purchaseAmount)) {
      console.log('Both couponCode and a valid purchaseAmount are required.');
      return;
    }

    const normalizedCode = couponCode.trim().toLowerCase();
    const coupon = coupons.find(c => c.code.toLowerCase() === normalizedCode);

    if (coupon) {
      setAppliedCoupon({
        couponCode: coupon?.code,
        purchaseAmount,
      });
      console.log(`Coupon applied successfully: ${coupon.code}`);
    } else {
      console.log(`Invalid coupon: ${couponCode}`);
    }
  };

  const clearAppliedCoupon = () => {
    setAppliedCoupon(null);
    console.log('Applied coupon cleared.');
  };

  const value = {
    coupons,
    appliedCoupon,
    loading,
    fetchCoupons,
    applyCoupon,
    clearAppliedCoupon,
  };

  return (
    <CouponContext.Provider value={value}>
      {children}
    </CouponContext.Provider>
  );
};

export { CouponContext, CouponProvider };
