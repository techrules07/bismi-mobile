import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ShirtDetails = ({selectedShirt, favorites, toggleFavorite}) => {
  const [selectedSize, setSelectedSize] = useState(null);

  return (
    <ScrollView style={styles.detailsContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={{uri: selectedShirt.image}}
          style={styles.selectedImage}
        />
      </View>

      <View style={styles.iconContainer}>
        <Text style={styles.shirtTitle}>{selectedShirt.name}</Text>
        <View style={styles.iconView}>
          <Icon
            name="share-variant"
            size={30}
            color="gray"
            style={styles.icon}
          />
          <TouchableOpacity onPress={() => toggleFavorite(selectedShirt.id)}>
            <Icon
              name={
                favorites.includes(selectedShirt.id) ? 'heart' : 'heart-outline'
              }
              size={30}
              color={favorites.includes(selectedShirt.id) ? 'red' : 'gray'}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.price}>{selectedShirt.price}</Text>

      {/* Available Sizes Section */}
      <Text style={styles.sectionTitle}>Available Sizes:</Text>
      <View style={styles.sizeOptions}>
        {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
          <TouchableOpacity
            key={size}
            style={[
              styles.sizeButton,
              selectedSize === size && styles.selectedSize,
            ]}
            onPress={() => setSelectedSize(size)}>
            <Text style={styles.sizeText}>{size}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Product Details Section */}
      <Text style={styles.sectionTitle}>Product Details:</Text>
      <View style={styles.detailsSection}>
        <Text style={styles.detailsText}>Brand: {selectedShirt.brand}</Text>
        <Text style={styles.detailsText}>
          Material: {selectedShirt.material}
        </Text>
        <Text style={styles.detailsText}>Fit: {selectedShirt.fit}</Text>
        <Text style={styles.detailsText}>Color: {selectedShirt.color}</Text>
      </View>

      {/* Product Description Section */}
      <Text style={styles.sectionTitle}>Product Description:</Text>
      <Text style={styles.descriptionText}>{selectedShirt.description}</Text>

      {/* Similar Collections Section */}
      <Text style={styles.sectionTitle}>Similar Collections:</Text>
      <ScrollView
        horizontal
        style={styles.similarItemsContainer}
        showsHorizontalScrollIndicator={false}>
        {selectedShirt?.similarItems?.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image source={{uri: item.image}} style={styles.cardImage} />
            <View style={styles.shirtInfo}>
              <Text style={styles.cardTitle}>{item.title || 'Shirt'}</Text>
              <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                <Icon
                  name={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
                  size={24}
                  color={favorites.includes(item.id) ? 'red' : '#ccc'}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.cardPrice}>{item.price}</Text>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

const ShirtListView = ({route}) => {
  const navigation = useNavigation();
  const {selectedShirt, favorites, toggleFavorite} = route.params;

  const [favoriteItems, setFavoriteItems] = useState(favorites);

  const handleFavoriteToggle = id => {
    const updatedFavorites = favoriteItems.includes(id)
      ? favoriteItems.filter(item => item !== id)
      : [...favoriteItems, id];
    setFavoriteItems(updatedFavorites);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name="arrow-left"
            size={24}
            color="#fff"
            onPress={() => navigation.navigate('ShirtList')}
          />
          <Text style={styles.headerTitle}>Shirts</Text>
        </View>

        <View style={styles.headerIcons}>
          <Icon name="magnify" size={24} color="#fff" />
          <Icon name="microphone" size={24} color="#fff" />
          <Icon name="camera" size={24} color="#fff" />
          <Icon name="cart" size={24} color="#fff" onPress={() => navigation.navigate('Cart')}/>
        </View>
      </View>

      <ShirtDetails
        selectedShirt={selectedShirt}
        favorites={favoriteItems}
        toggleFavorite={handleFavoriteToggle}
      />
    </View>
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
  detailsContainer: {
    paddingBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
  },
  selectedImage: {
    width: '100%',
    height: 300,
    marginBottom: 15,
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 5,
  },
  iconView: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 10,
  },
  price: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 5,
  },
  shirtTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    padding: 5,
    color: 'black',
  },
  sizeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  sizeButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  selectedSize: {
    backgroundColor: '#EDE0D4',
    color:"white"
  },
  sizeText: {
    fontSize: 16,
    color:"black"
  },
  detailsSection: {
    marginBottom: 10,
    padding: 5,
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 15,
    padding: 5,
    color: 'gray',
  },
  similarItemsContainer: {
    paddingVertical: 15,
    flexDirection: 'row',
    gap: 15,
  },
  card: {
    width: 150,
    marginLeft: 10,
    borderWidth: 0, // No border
    borderRadius: 0, // No rounded corners
    gap: 10,
  },
  cardImage: {
    width: '100%',
    height: 150,
    marginBottom: 5,
  },
  shirtInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default ShirtListView;
