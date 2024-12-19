import {View, Text, Pressable} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';

const SuccessScreen = () => {
  return (
    <View style={{flex: 1, gap: '20px'}}>
      <LottieView
        style={{flex: 1}}
        source={require('./success.json')}
        autoPlay
        loop={false}
      />
      <Text style={{color: 'white', fontSize: 20, marginBottom: 20}}>
        Your order has been placed successfully
      </Text>
      <View
        style={{
          borderRadius: 8,
          overflow: 'hidden', // Confines ripple effect within the button bounds
        }}>
        <Pressable
          android_ripple={{color: '#bb86fc'}}
          style={({pressed}) => ({
            backgroundColor: pressed ? '#3700b3' : '#6200ee',
            paddingVertical: 12,
            paddingHorizontal: 20,
          })}
          onPress={() => console.log('Button Pressed')}>
          <Text
            style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Continue
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SuccessScreen;
