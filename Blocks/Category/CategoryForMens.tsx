import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
} from 'react-native';

const CategoryForMens = props => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigation = useNavigation();

  const mensClothing = [
    {
      id: '1',
      name: 'Shirt',
      image:
        'https://images.pexels.com/photos/2279375/pexels-photo-2279375.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    },
    {
      id: '2',
      name: 'Pants',
      image:
        'https://images.pexels.com/photos/1192060/pexels-photo-1192060.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    },
    {
      id: '3',
      name: 'Jacket',
      image:
        'https://images.pexels.com/photos/1122463/pexels-photo-1122463.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    },
    {
      id: '4',
      name: 'T-Shirt',
      image:
        'https://images.pexels.com/photos/1612741/pexels-photo-1612741.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    },
    {
      id: '5',
      name: 'Sweater',
      image:
        'https://images.pexels.com/photos/3692644/pexels-photo-3692644.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    },
    {
      id: '6',
      name: 'Shorts',
      image:
        'https://images.pexels.com/photos/1192060/pexels-photo-1192060.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    },
  ];

  const footwear = [
    {
      id: '1',
      name: 'Sneakers',
      image:
        'https://images.pexels.com/photos/1192060/pexels-photo-1192060.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    },
    {
      id: '2',
      name: 'Boots',
      image:
        'https://images.pexels.com/photos/2958088/pexels-photo-2958088.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    },
    {
      id: '3',
      name: 'Sandals',
      image:
        'https://images.pexels.com/photos/3711286/pexels-photo-3711286.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    },
    {
      id: '4',
      name: 'Loafers',
      image:
        'https://images.pexels.com/photos/3275167/pexels-photo-3275167.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    },
    {
      id: '5',
      name: 'Flip Flops',
      image:
        'https://images.pexels.com/photos/3692644/pexels-photo-3692644.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    },
    {
      id: '6',
      name: 'Slippers',
      image:
        'https://images.pexels.com/photos/1192060/pexels-photo-1192060.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    },
  ];

  const womenWear = [
    {
      id: '1',
      name: 'Dress',
      image:
        'https://images.pexels.com/photos/4531170/pexels-photo-4531170.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    },
    {
      id: '2',
      name: 'Blouse',
      image:
        'https://images.pexels.com/photos/4369179/pexels-photo-4369179.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    },
    {
      id: '3',
      name: 'Skirt',
      image:
        'https://images.pexels.com/photos/1192060/pexels-photo-1192060.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    },
    {
      id: '4',
      name: 'Tunic',
      image:
        'https://images.pexels.com/photos/3361164/pexels-photo-3361164.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    },
    {
      id: '5',
      name: 'Pantsuit',
      image:
        'https://images.pexels.com/photos/1535489/pexels-photo-1535489.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    },
    {
      id: '6',
      name: 'Cardigan',
      image:
        'https://images.pexels.com/photos/3831119/pexels-photo-3831119.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    },
    {
      id: '7',
      name: 'Dress',
      image:
        'https://images.pexels.com/photos/4531170/pexels-photo-4531170.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    },
    {
      id: '8',
      name: 'Blouse',
      image:
        'https://images.pexels.com/photos/4369179/pexels-photo-4369179.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    },
    {
      id: '9',
      name: 'Skirt',
      image:
        'https://images.pexels.com/photos/1192060/pexels-photo-1192060.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    },
  ];

  const renderItems = items => {
    return (
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({item}) => (
          <View style={styles.recentItem} onTouchEnd={() => handleCategoryClick(item.name)}>
            <Image source={{uri: item.image}} style={styles.roundedImage} />
            <Text
              style={styles.recentText}
              onPress={() => handleCategoryClick(item.name)}>
              {item.name}
            </Text>
          </View>
        )}
      />
    );
  };
  const handleCategoryClick = categoryName => {
    if (categoryName === 'Shirt') {
      setSelectedCategory('Shirt');
      navigation.navigate('ShirtList');
    } else {
      setSelectedCategory(null);
    }
  };
  return (
    <ScrollView style={styles.container}>
      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Mens Clothing */}
        <Text style={styles.sectionTitle}>Mens Clothing</Text>
        {renderItems(mensClothing)}

        {/* Mens Footwear and Accessories */}
        <Text style={styles.sectionTitle}>Mens Footwear and Accessories</Text>
        {renderItems(footwear)}

        {/* Womens Wear */}
        <Text style={styles.sectionTitle}>Womens Wear</Text>
        {renderItems(womenWear)}
      </View>
      {/* {selectedCategory === 'Shirt' && <ShirtList />} */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#703F07',
  },
  headerTitle: {fontSize: 18, fontWeight: 'bold', color: '#fff'},
  headerIcons: {flexDirection: 'row', gap: 15},
  content: {flexDirection: 'column', flex: 1},
  mainContent: {padding: 10},
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#703F07',
  },
  columnWrapper: {justifyContent: 'space-between'},
  recentItem: {alignItems: 'center', marginBottom: 10},
  roundedImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  recentText: {marginTop: 5, fontSize: 12, textAlign: 'center'},
});

export default CategoryForMens;
