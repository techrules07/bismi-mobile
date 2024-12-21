import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {
  applyCoupons,
  getAllCoupons,
  updateCoupons,
} from '../../Networking/CouponPageService';
import {CouponContext} from '../../Context/CouponContext';
import {UserContext} from '../../Context/UserContext';

const CouponsPage = () => {
  const navigation = useNavigation();
  const [coupon, setCoupon] = useState([]);
  const {user} = useContext(UserContext);
  const {applyCoupon} = useContext(CouponContext);

  useEffect(() => {
    const getAllCoupon = async () => {
      try {
        const couponsResponse = await getAllCoupons();
        if (
          couponsResponse?.code === 200 &&
          couponsResponse?.status === 'Success'
        ) {
          setCoupon(couponsResponse?.data);
        } else {
          throw new Error('Failed to retrieve coupon details');
        }
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };

    getAllCoupon();
  }, []);

  const applyCouponFor = async _item => {
    try {
      if (!_item?.active) {
        Alert.alert('Coupon Expired', 'Sorry, this coupon has expired');
        return;
      }

      const couponCode = _item?.couponCode;
      const purchaseAmount = _item?.minimumPurchaseAmount;

      if (!couponCode || !purchaseAmount) {
        Alert.alert('Error', 'Invalid coupon or purchase amount.');
        return;
      }

      const couponResponse = await applyCoupons({couponCode, purchaseAmount});

      if (
        couponResponse?.code === 200 &&
        couponResponse?.status === 'Success'
      ) {
        applyCoupon({couponCode, purchaseAmount});

        const userId = user?.id;
        const updateResponse = await updateCoupons({
          requestUserId: userId,
          requestCouponCode: couponCode,
        });

        if (
          updateResponse?.code === 200 &&
          updateResponse?.status === 'Success'
        ) {
          // Update the coupon state to reflect the coupon is no longer active
          setCoupon(prevCoupons =>
            prevCoupons.map(item =>
              item.couponCode === couponCode ? {...item, active: false} : item,
            ),
          );

          Alert.alert(
            'Coupon Applied',
            `You have successfully applied ${couponCode}`,
          );
        } else {
          Alert.alert('Error', 'Failed to update coupon in the backend.');
        }
      } else {
        Alert.alert(
          'Error',
          couponResponse?.message || 'Failed to apply coupon',
        );
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      Alert.alert('Error', 'An error occurred while applying the coupon.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name="arrow-left"
            size={24}
            color="#fff"
            onPress={() => navigation.navigate('Account')}
          />
          <Text style={styles.headerTitle}>Coupons</Text>
        </View>

        <View style={styles.headerIcons}>
          <Icon name="magnify" size={24} color="#fff" />
          <Icon
            name="cart"
            size={24}
            color="#fff"
            onPress={() => navigation.navigate('Cart')}
          />
        </View>
      </View>

      <View style={{padding: 10}}>
        <Text style={styles.pageTitle}>Available Coupon</Text>
        <View style={styles.circle}></View>
        <View style={styles.circleRight}></View>
        {coupon?.map(_item => (
          <View style={styles.couponCard}>
            <View style={styles.row}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{uri: _item?.couponImage}}
                  style={styles.couponImage}
                />
              </View>

              <View style={styles.dottedLine}></View>
              <View style={styles.details}>
                <Text style={styles.couponDescription}>
                  {_item?.description}
                </Text>
                <Text style={styles.couponDescription}>
                  Coupon code : {_item?.couponCode}
                </Text>
                <Text style={styles.expiryText}>Expires: {_item?.endDate}</Text>
                <Text style={styles.minPurchase}>
                  Min Purchase: ₹{_item?.minimumPurchaseAmount}
                </Text>
                {/* <Text
                  style={
                    _item.active === true
                      ? styles.activeText
                      : styles.expiredText
                  }>
                  {_item.active === true ? 'Active' : 'Expired'}
                </Text> */}
                <TouchableOpacity
                  style={
                    _item.active === true
                      ? styles.applyButton
                      : styles.disabledButton
                  }
                  onPress={() => applyCouponFor(_item)}
                  disabled={_item.active !== true}>
                  <Text style={styles.buttonText}>Apply Coupon</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#703F07',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerIcons: {flexDirection: 'row', gap: 15},
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  couponCard: {
    backgroundColor: '#EDE0D4',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 20,
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  imageWrapper: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
  },
  couponImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: 'cover',
  },
  circle: {
    position: 'absolute',
    top: '65%',
    left: '5%',
    width: 40,
    height: 30,
    borderRadius: 30,
    backgroundColor: '#fff',
    transform: [{translateX: -30}, {translateY: -30}],
    zIndex: 1,
  },
  circleRight: {
    position: 'absolute',
    top: '65%',
    right: '-10%',
    width: 40,
    height: 30,
    borderRadius: 30,
    backgroundColor: '#fff',
    transform: [{translateX: -30}, {translateY: -30}],
    zIndex: 1,
  },
  details: {
    flex: 2,
    paddingLeft: 10,
  },
  couponDescription: {
    fontSize: 14,
    color: '#555',
    marginVertical: 10,
  },
  expiryText: {
    fontSize: 12,
    color: '#888',
  },
  minPurchase: {
    fontSize: 12,
    color: '#888',
  },
  activeText: {
    color: 'green',
    fontWeight: 'bold',
  },
  expiredText: {
    color: 'red',
    fontWeight: 'bold',
  },
  applyButton: {
    backgroundColor: '#703F07',
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 15,
  },
  disabledButton: {
    backgroundColor: '#ddd',
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dottedLine: {
    width: 1,
    height: 150,
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: '#000',
    marginHorizontal: 10,
  },
});

export default CouponsPage;
