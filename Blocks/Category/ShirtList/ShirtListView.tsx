import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Button,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const ShirtDetails = ({selectedShirt}) => {
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
          <Icon
            name="heart-outline"
            size={30}
            color="gray"
            style={styles.icon}
          />
        </View>
      </View>
      <Text style={styles.price}>{selectedShirt.price}</Text>
      {/* Size Options */}
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

      {/* Reviews and Photos */}
      <Text style={styles.sectionTitle}>Reviews:</Text>
      <Text>{selectedShirt.reviews}</Text>
      <Text style={styles.sectionTitle}>Photos:</Text>
      <View style={styles.photoContainer}>
        {selectedShirt?.photos?.map((photo, index) => (
          <Image key={index} source={{uri: photo}} style={styles.reviewPhoto} />
        ))}
      </View>

      {/* Similar Items Section */}
      <Text style={styles.sectionTitle}>Similar Collections:</Text>
      <View style={styles.similarItemsContainer}>
        {selectedShirt?.similarItems?.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image source={{uri: item.image}} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.title || 'Shirt'}</Text>
            <Text style={styles.cardPrice}>${item.price}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
   
  );
};

const ShirtListView = ({route,props}) => {
  const {selectedShirt} = route.params;
  const shirts = [
    {
      id: 1,
      image: 'https://via.placeholder.com/350',
      title: 'Shirt 1',
      size: 'M',
      price: 25,
      reviews: '4.5/5',
      photos: [
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
      ],
      similarItems: [
        {title: 'Shirt 3', image: 'https://via.placeholder.com/150', price: 30},
        {title: 'Shirt 4', image: 'https://via.placeholder.com/150', price: 35},
        {title: 'Shirt 5', image: 'https://via.placeholder.com/150', price: 40},
      ],
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/350',
      title: 'Shirt 2',
      size: 'L',
      price: 30,
      reviews: '4/5',
      photos: [
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
      ],
      similarItems: [
        {title: 'Shirt 6', image: 'https://via.placeholder.com/150', price: 45},
        {title: 'Shirt 7', image: 'https://via.placeholder.com/150', price: 50},
        {title: 'Shirt 8', image: 'https://via.placeholder.com/150', price: 55},
      ],
    },
  ];

  const shirt = selectedShirt;

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
   
      <ShirtDetails selectedShirt={shirt} />
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#703F07',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  headerIcons: { flexDirection: 'row', gap: 15 },
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
  },
  iconView: {
    display: 'flex',
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 10,
  },
  price: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  shirtTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color:"black"
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
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
    backgroundColor: '#b0e0e6', // Highlight selected size
  },
  sizeText: {
    fontSize: 16,
  },
  reviewPhoto: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  photoContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  similarItemsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  card: {
    width: 150,
    marginRight: 15,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    alignItems: 'center',
    padding: 10,
  },
  cardImage: {
    width: '100%',
    height: 120,
    marginBottom: 10,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardPrice: {
    color: '#00b300',
    fontSize: 16,
  },
});

export default ShirtListView;
