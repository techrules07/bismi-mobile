//@ts-nocheck
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {UserContext} from '../Context/UserContext';
import {useNavigation} from '@react-navigation/native';
import LoginScreen from './Login';
import UserAdapter from '../Networking/UserPageService';

const Account = props => {

  const navigation = useNavigation();
  const {user, logout, userDetail} = useContext(UserContext);
  console.log('userDetail', userDetail);

  //usestate management
  const [errorMessage, setErrorMessage] = useState('');
  const handleLogout = () => {
    logout();
  };
  
  const getInitial = () => {
    return userDetail?.name
      ? userDetail?.name.charAt(0).toUpperCase()
      : user?.name
      ? user?.name.charAt(0).toUpperCase()
      : '';
  };

  return user ? (
    <ScrollView style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}></View>
        <View style={styles.profileContent}>
          <View style={styles.profilePhoto}>
            {userDetail?.name || user?.name ? (
              <Text style={styles.initialText}>{getInitial()}</Text>
            ) : (
              <Text style={styles.initialText}>?</Text>
            )}
          </View>
          <View style={styles.content}>
            <Text style={styles.profileName}>
              {userDetail?.name || user?.name}
            </Text>
            <Text style={styles.profiler}>(Member)</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>My Account</Text>
          <View style={styles.cardContent}>
            <TouchableOpacity
              style={styles.textContainer}
              onPress={() => props.navigation.navigate('OrderList')}>
              <View style={styles.textContain}>
                <View style={{marginTop: 3}}>
                  <MaterialCommunityIcons name="cart-outline" size={16} />
                </View>
                <Text style={styles.list}>Orders</Text>
              </View>
              <View>
                <MaterialIcons name="keyboard-arrow-right" size={16} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.textContainer}
              onPress={() => props.navigation.navigate('Whislist')}>
              <View style={styles.textContain}>
                <View style={{marginTop: 3}}>
                  <MaterialCommunityIcons
                    name="cards-heart-outline"
                    size={16}
                  />
                </View>
                <Text style={styles.list}>Wishlist</Text>
              </View>
              <View>
                <MaterialIcons name="keyboard-arrow-right" size={16} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.textContainer}
              onPress={() => props.navigation.navigate('Coupons')}>
              <View style={styles.textContain}>
                <View style={{marginTop: 3}}>
                  <MaterialCommunityIcons name="gift-outline" size={16} />
                </View>
                <Text style={styles.list}>Coupons</Text>
              </View>
              <View>
                <MaterialIcons name="keyboard-arrow-right" size={16} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Settings</Text>
          <View style={styles.cardContent}>
            <TouchableOpacity
              style={styles.textContainer}
              onPress={() => props.navigation.navigate('EditProfile')}>
              <View style={styles.textContain}>
                <View style={{marginTop: 3}}>
                  <MaterialCommunityIcons
                    name="account-edit-outline"
                    size={16}
                  />
                </View>
                <Text style={styles.list}>Edit Profile</Text>
              </View>
              <View>
                <MaterialIcons name="keyboard-arrow-right" size={16} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.textContainer}
              onPress={() => props.navigation.navigate('Payment')}>
              <View style={styles.textContain}>
                <View style={{marginTop: 3}}>
                  <MaterialIcons name="payment" size={16} />
                </View>
                <Text style={styles.list}>Saved Payments</Text>
              </View>
              <View>
                <MaterialIcons name="keyboard-arrow-right" size={16} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.textContainer}
              onPress={() => props.navigation.navigate('Address')}>
              <View style={styles.textContain}>
                <View style={{marginTop: 3}}>
                  <MaterialCommunityIcons
                    name="book-open-page-variant-outline"
                    size={16}
                  />
                </View>
                <Text style={styles.list}>Saved Address</Text>
              </View>
              <View>
                <MaterialIcons name="keyboard-arrow-right" size={16} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Help & Support</Text>
          <View style={styles.cardContent}>
            <TouchableOpacity
              style={styles.textContainer}
              onPress={() => props.navigation.navigate('Faqs')}>
              <View style={styles.textContain}>
                <View style={{marginTop: 3}}>
                  <MaterialCommunityIcons
                    name="file-question-outline"
                    size={16}
                  />
                </View>
                <Text style={styles.list}>Browse FAQs</Text>
              </View>
              <View>
                <MaterialIcons name="keyboard-arrow-right" size={16} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>General Settings</Text>
          <View style={styles.cardContent}>
            <TouchableOpacity
              style={styles.textContainer}
              onPress={() => props.navigation.navigate('ThemeSettings')}>
              <View style={styles.textContain}>
                <View style={{marginTop: 3}}>
                  <MaterialCommunityIcons
                    name="file-question-outline"
                    size={16}
                  />
                </View>
                <Text style={styles.list}>Theme</Text>
              </View>
              <View>
                <MaterialIcons name="keyboard-arrow-right" size={16} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.card, styles.logoutCard]}>
          <View style={styles.logoutButtonContainer}>
            <Button title="Log Out" color="#703F07" onPress={handleLogout} />
          </View>
        </View>
      </View>
    </ScrollView>
  ) : (
    <LoginScreen />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDE0D4',
  },
  content: {
    marginTop: 20,
  },
  profileCard: {
    backgroundColor: '#fff',
    marginBottom: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  profileHeader: {
    backgroundColor: '#703F07',
    height: 70,
  },
  profileContent: {
    display: 'flex',
    marginVertical: 10,
    flexDirection: 'row',
    gap: 10,
    marginLeft: 20,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderWidth: 3,
    borderColor: '#FFE6A7',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  initialText: {
    fontSize: 40,
    color: '#703F07',
    fontWeight: 'bold',
  },
  profileName: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profiler: {
    color: '#703F07',
  },
  cardsContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 5,
    width: '100%',
    justifyContent: 'center',
    padding: 10,
  },
  cardTitle: {
    color: '#703F07',
    fontSize: 16,
    fontWeight: 'bold',
    margin: 10,
  },
  cardContent: {
    marginLeft: 10,
    gap: 10,
  },
  logoutCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    color: 'black',
    fontSize: 16,
  },
  logoutButtonContainer: {
    width: '90%',
    alignSelf: 'center',
  },
  textContain: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Account;
