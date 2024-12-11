import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const shirtsData = [
  {
    id: '1',
    name: 'Blue T-shirt',
    price: '₹599',
    image: 'https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg',
  },
  {
    id: '2',
    name: 'Red Polo Shirt',
    price: '₹799',
    image:
      'https://images.pexels.com/photos/4531170/pexels-photo-4531170.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
  },
  {
    id: '3',
    name: 'Green Casual Shirt',
    price: '₹899',
    image: 'https://images.pexels.com/photos/2065200/pexels-photo-2065200.jpeg',
  },
  {
    id: '4',
    name: 'Black Formal Shirt',
    price: '₹1299',
    image: 'https://images.pexels.com/photos/1192601/pexels-photo-1192601.jpeg',
  },
];

const ShirtList = (props) => {
    const navigation = useNavigation();
  const [favorites, setFavorites] = useState(new Set());
  const [selectedShirt, setSelectedShirt] = useState(null); // State to manage selected shirt

  const toggleFavorite = (id) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = new Set(prevFavorites);
      if (updatedFavorites.has(id)) {
        updatedFavorites.delete(id);
      } else {
        updatedFavorites.add(id);
      }
      return updatedFavorites;
    });
  };

  const handleShirtSelect = (shirt) => {
    setSelectedShirt(shirt); 
    navigation.navigate('ShirtListView', { selectedShirt: shirt });
  };

  const renderShirtItem = ({ item }) => {
    const isFavorited = favorites.has(item.id);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleShirtSelect(item)} // Trigger shirt select when pressed
      >
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.cardContent}>
          <View style={styles.shirtInfo}>
            <Text style={styles.shirtName}>{item.name}</Text>
            <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
              <Icon
                name={isFavorited ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorited ? 'red' : '#ccc'}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.price}>{item.price}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
          <Icon
            name="arrow-left"
            size={24}
            color="#fff"
            onPress={() => props.navigation.navigate('Category')}
          />
          <Text style={styles.headerTitle}>All Categories</Text>
        </View>

        <View style={styles.headerIcons}>
          <Icon name="magnify" size={24} color="#fff" />
          <Icon name="microphone" size={24} color="#fff" />
          <Icon name="camera" size={24} color="#fff" />
          <Icon name="cart" size={24} color="#fff" />
        </View>
      </View>

      {/* Shirt List */}
      <FlatList
        data={shirtsData}
        renderItem={renderShirtItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#703F07',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  headerIcons: { flexDirection: 'row', gap: 15 },

  listContainer: { paddingHorizontal: 10, paddingTop: 10 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 5,
    flex: 1,
    maxWidth: '48%',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: { padding: 10 },
  shirtInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shirtName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  price: { fontSize: 14, color: '#666', marginTop: 5 },
});

export default ShirtList;
