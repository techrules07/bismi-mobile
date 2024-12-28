import React from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';

const ToastMessage = ({
  setToast = (any: boolean) => {},
  text2Press = () => {},
  text1Press = () => {},
  text1 = '',
  text2 = '',
}) => {
  const bottom = React.useRef(new Animated.Value(-80)).current;
  const opacity = React.useRef(new Animated.Value(1)).current;

  function animate() {
    Animated.timing(bottom, {
      toValue: 20,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 5000,
        useNativeDriver: false,
      }).start(() => {
        setToast(false);
      });
    });
  }

  React.useEffect(() => {
    animate();
  }, []);

  return (
    <Animated.View style={[styles.container, {bottom, opacity}]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        }}>
        <Text
          onPress={text1Press}
          style={{color: 'white', fontWeight: 'bold', fontSize: 17}}>
          {text1}
        </Text>
        <Text onPress={text2Press} style={{color: 'gold', fontSize: 17}}>
          {text2}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    paddingVertical: 23,
    backgroundColor: 'black',
    position: 'absolute',
    borderRadius: 8,
    zIndex: 10,
    width: '90%',
  },
});

export default ToastMessage;
