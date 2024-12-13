import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const shirtsData = [
  {
    id: '1',
    name: 'Blue T-shirt',
    price: '₹599',
    image: 'https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg',
    description:
      'A comfortable and lightweight blue t-shirt perfect for casual wear.',
    material: '100% Cotton',
    fit: 'Regular Fit',
    color: 'Blue',
    similarItems: [
      {
        id: '1-1',
        title: 'Navy Blue T-shirt',
        price: '₹549',
        image:
          'https://images.pexels.com/photos/2950003/pexels-photo-2950003.jpeg',
      },
      {
        id: '1-2',
        title: 'Sky Blue T-shirt',
        price: '₹499',
        image:
          'https://images.pexels.com/photos/1587665/pexels-photo-1587665.jpeg',
      },
      {
        id: '1-3',
        title: 'Blue Round-neck',
        price: '₹699',
        image:
          'https://images.pexels.com/photos/1764425/pexels-photo-1764425.jpeg',
      },
    ],
  },
  {
    id: '2',
    name: 'Red Polo Shirt',
    price: '₹799',
    image:
      'https://images.pexels.com/photos/4531170/pexels-photo-4531170.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    description:
      'Stylish and versatile red polo shirt, ideal for semi-formal and casual outings.',
    material: '60% Cotton, 40% Polyester',
    fit: 'Slim Fit',
    color: 'Red',
    similarItems: [
      {
        id: '2-1',
        title: 'Maroon Polo Shirt',
        price: '₹749',
        image:
          'https://images.pexels.com/photos/2179210/pexels-photo-2179210.jpeg',
      },
      {
        id: '2-2',
        title: 'Bright Red Polo Shirt',
        price: '₹899',
        image:
          'https://images.pexels.com/photos/1096667/pexels-photo-1096667.jpeg',
      },
      {
        id: '2-3',
        title: 'Burgundy Polo Shirt',
        price: '₹799',
        image:
          'https://images.pexels.com/photos/794062/pexels-photo-794062.jpeg',
      },
    ],
  },
  {
    id: '3',
    name: 'Green Casual Shirt',
    price: '₹899',
    image: 'https://images.pexels.com/photos/2065200/pexels-photo-2065200.jpeg',
    description:
      'Trendy green casual shirt that pairs well with jeans or chinos.',
    material: 'Linen Blend',
    fit: 'Regular Fit',
    color: 'Green',
    similarItems: [
      {
        id: '3-1',
        title: 'Olive Green Shirt',
        price: '₹849',
        image:
          'https://images.pexels.com/photos/3756354/pexels-photo-3756354.jpeg',
      },
      {
        id: '3-2',
        title: 'Dark Green Casual Shirt',
        price: '₹999',
        image:
          'https://images.pexels.com/photos/1284019/pexels-photo-1284019.jpeg',
      },
      {
        id: '3-3',
        title: 'Mint Green Shirt',
        price: '₹899',
        image:
          'https://images.pexels.com/photos/2882778/pexels-photo-2882778.jpeg',
      },
    ],
  },
  {
    id: '4',
    name: 'Black Formal Shirt',
    price: '₹1299',
    image: 'https://images.pexels.com/photos/1192601/pexels-photo-1192601.jpeg',
    description:
      'Elegant black formal shirt for office wear or special occasions.',
    material: 'Silk Blend',
    fit: 'Tailored Fit',
    color: 'Black',
    similarItems: [
      {
        id: '4-1',
        title: 'Charcoal Black Shirt',
        price: '₹1249',
        image:
          'https://images.pexels.com/photos/1072343/pexels-photo-1072343.jpeg',
      },
      {
        id: '4-2',
        title: 'Jet Black Slim Shirt',
        price: '₹1399',
        image:
          'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
      },
      {
        id: '4-3',
        title: 'Classic Black Shirt',
        price: '₹1199',
        image:
          'https://images.pexels.com/photos/1666304/pexels-photo-1666304.jpeg',
      },
    ],
  },
];

const ShirtList = props => {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState(new Set());
  const [selectedShirt, setSelectedShirt] = useState(null);
  const [filteredData, setFilteredData] = useState(shirtsData);
  const [sortVisible, setSortVisible] = useState(false); // State for Sort Modal
  const [selectedSort, setSelectedSort] = useState(null); // Selected sort option

  const handleSortOptionSelect = option => {
    setSelectedSort(option);
    setSortVisible(false); // Close modal after selecting
    // Apply sorting logic here based on 'option'
    if (option === 'Low Price') {
      shirtsData.sort((a, b) => a.price - b.price);
    } else if (option === 'High Price') {
      shirtsData.sort((a, b) => b.price - a.price);
    } else if (option === 'Popularity') {
      // Example: Sort alphabetically by name (mock popularity)
      shirtsData.sort((a, b) => a.name.localeCompare(b.name));
    }
  };
  const toggleFavorite = id => {
    setFavorites(prevFavorites => {
      const updatedFavorites = new Set(prevFavorites);
      if (updatedFavorites.has(id)) {
        updatedFavorites.delete(id);
      } else {
        updatedFavorites.add(id);
      }
      return updatedFavorites;
    });
  };

  const handleShirtSelect = shirt => {
    setSelectedShirt(shirt);
    navigation.navigate('ShirtListView', {
      selectedShirt: shirt,
      favorites: Array.from(favorites),
      toggleFavorite,
    });
  };
  const handleFilterApply = filteredShirts => {
    setFilteredData(filteredShirts);
  };
  const renderShirtItem = ({item}) => {
    const isFavorited = favorites.has(item.id);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleShirtSelect(item)}>
        <Image source={{uri: item.image}} style={styles.image} />
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
  const renderSortModal = () => (
    <Modal
      transparent
      animationType="slide"
      visible={sortVisible}
      onRequestClose={() => setSortVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.sortContainer}>
          <Text style={styles.sortTitle}>Sort By</Text>

          {['Low Price', 'High Price', 'Popularity'].map(option => (
            <TouchableOpacity
              key={option}
              style={styles.sortOption}
              onPress={() => setSelectedSort(option)}>
              <Text style={styles.sortText}>{option}</Text>
              <Icon
                name={
                  selectedSort === option ? 'radiobox-marked' : 'radiobox-blank'
                }
                size={24}
                color="#703F07"
              />
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => {
              handleSortOptionSelect(selectedSort);
              setSortVisible(false);
            }}>
            <Text style={styles.applyButtonText}>Apply Sort</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{display: 'flex', flexDirection: 'row', gap: 5}}>
          <Icon
            name="arrow-left"
            size={24}
            color="#fff"
            onPress={() => props.navigation.navigate('Category')}
          />
          <Text style={styles.headerTitle}>Shirts</Text>
        </View>

        <View style={styles.headerIcons}>
          <Icon name="magnify" size={24} color="#fff" />
          <Icon name="microphone" size={24} color="#fff" />
          <Icon name="camera" size={24} color="#fff" />
          <Icon name="cart" size={24} color="#fff" />
        </View>
      </View>
      <FlatList
        data={shirtsData}
        renderItem={renderShirtItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.footer}>
        <TouchableOpacity
          style={{flexDirection: 'row', gap: 5}}
          onPress={() =>
            navigation.navigate('FilterPage', {
              shirtsData,
              applyFilter: handleFilterApply,
            })
          }>
          <Icon name="filter-outline" size={28} color="#fff" />
          <Text style={styles.footerText}>Filter</Text>
        </TouchableOpacity>

        <View style={styles.divider} />
        <TouchableOpacity
          style={{flexDirection: 'row', gap: 5}}
          onPress={() => setSortVisible(true)}>
          <Icon name="filter-variant" size={28} color="#fff" />
          <Text style={styles.footerText}>Sort</Text>
        </TouchableOpacity>
      </View>
      {renderSortModal()}
    </View>
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

  listContainer: {paddingHorizontal: 10, paddingTop: 10},
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
  cardContent: {padding: 10},
  shirtInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shirtName: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  price: {fontSize: 14, color: '#666', marginTop: 5},
  footer: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    backgroundColor: '#703F07',
    padding: 10,
  },
  footerText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  divider: {
    width: 2,
    height: '100%',
    backgroundColor: '#ddd',
    marginHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sortContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  sortTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#703F07',
    marginBottom: 20,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sortText: {
    fontSize: 18,
    color: '#333',
  },
  applyButton: {
    backgroundColor: '#703F07',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ShirtList;
