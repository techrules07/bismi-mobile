//@ts-nocheck
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CategoryForMens from './CategoryForMens';

const sidebarCategories = [
  {
    id: 1,
    name: 'Grocery',
    icon: 'https://images.pexels.com/photos/749353/pexels-photo-749353.jpeg',
  },
  {
    id: 2,
    name: 'Fashion',
    icon: 'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg',
  },
  {
    id: 3,
    name: 'Appliances',
    icon: 'https://images.pexels.com/photos/3965559/pexels-photo-3965559.jpeg',
  },
  {
    id: 4,
    name: 'Mobiles',
    icon: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg',
  },
  {
    id: 5,
    name: 'Electronics',
    icon: 'https://images.pexels.com/photos/4709283/pexels-photo-4709283.jpeg',
  },
  {
    id: 6,
    name: 'Smart Gadgets',
    icon: 'https://images.pexels.com/photos/7129035/pexels-photo-7129035.jpeg',
  },
  {
    id: 7,
    name: 'Home',
    icon: 'https://images.pexels.com/photos/7061644/pexels-photo-7061644.jpeg',
  },
  {
    id: 8,
    name: 'Appliances',
    icon: 'https://images.pexels.com/photos/3965559/pexels-photo-3965559.jpeg',
  },
  {
    id: 9,
    name: 'Mobiles',
    icon: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg',
  },
  {
    id: 10,
    name: 'Electronics',
    icon: 'https://images.pexels.com/photos/4709283/pexels-photo-4709283.jpeg',
  },
  {
    id: 11,
    name: 'Smart Gadgets',
    icon: 'https://images.pexels.com/photos/7129035/pexels-photo-7129035.jpeg',
  },
  {
    id: 12,
    name: 'Home',
    icon: 'https://images.pexels.com/photos/7061644/pexels-photo-7061644.jpeg',
  },
];

const popularStores = [
  {
    id: 1,
    name: 'Shaadi Specials',
    image: 'https://images.pexels.com/photos/4709283/pexels-photo-4709283.jpeg',
    price: 'Up to 12000',
  },
  {
    id: 2,
    name: 'Merry Christmas!',
    image: 'https://images.pexels.com/photos/2065200/pexels-photo-2065200.jpeg',
    price: 'Up to 12000',
  },
  {
    id: 3,
    name: 'Winter Store',
    image: 'https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg',
    price: 'Up to 12000',
  },
  {
    id: 4,
    name: "Kid's Zone",
    image:
      'https://images.pexels.com/photos/40815/kids-child-painted-hands-40815.jpeg',
    price: 'Up to 12000',
  },
  {
    id: 5,
    name: 'Pocket Bazaar',
    image: 'https://images.pexels.com/photos/1161462/pexels-photo-1161462.jpeg',
    price: 'Up to 12000',
  },
  {
    id: 6,
    name: 'Trendy Women',
    image: 'https://images.pexels.com/photos/4586521/pexels-photo-4586521.jpeg',
    price: 'Up to 12000',
  },
];

const recentlyViewed = [
  {
    id: 1,
    name: "Women's Dress",
    image: 'https://images.pexels.com/photos/1192601/pexels-photo-1192601.jpeg',
  },
  {
    id: 2,
    name: "Women's Skirt",
    image: 'https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg',
  },
  {
    id: 3,
    name: "Women's Top",
    image: 'https://images.pexels.com/photos/2065200/pexels-photo-2065200.jpeg',
  },
];
const newLaunches = [
  {
    id: 1,
    name: "Women's Skirt",
    image: 'https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg',
  },
  {
    id: 2,
    name: "Women's Top",
    image: 'https://images.pexels.com/photos/2065200/pexels-photo-2065200.jpeg',
  },
  {
    id: 3,
    name: 'New Smartwatch',
    image: 'https://images.pexels.com/photos/4709283/pexels-photo-4709283.jpeg',
  },
  {
    id: 4,
    name: 'Gaming Laptop',
    image: 'https://images.pexels.com/photos/2065200/pexels-photo-2065200.jpeg',
  },
];
const bismi = [
  {
    id: 1,
    name: 'New Smartwatch',
    image: 'https://images.pexels.com/photos/4709283/pexels-photo-4709283.jpeg',
  },
  {
    id: 2,
    name: 'Gaming Laptop',
    image: 'https://images.pexels.com/photos/2065200/pexels-photo-2065200.jpeg',
  },
  {
    id: 3,
    name: 'Winter Store',
    image: 'https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg',
  },
];
const Category = props => {
  const [selectedSection, setSelectedSection] = useState('For You');

  const handleSidebarClick = section => {
    setSelectedSection(section); // Update the selected section
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Categories</Text>
        <View style={styles.headerIcons}>
          <Icon name="magnify" size={24} color="#fff" />
          <Icon name="microphone" size={24} color="#fff" />
          <Icon name="camera" size={24} color="#fff" />
          <Icon name="cart" size={24} color="#fff" />
        </View>
      </View>

      <View style={styles.content}>
        {/* Sidebar - Top Fixed */}
        <View style={styles.sidebarContainer}>
          <View
            style={styles.forYouSection}
            onTouchEnd={() => handleSidebarClick('For You')}>
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/2065200/pexels-photo-2065200.jpeg',
              }}
              style={styles.roundedImages}
            />
            <Text style={styles.forYouTitle}>For You</Text>
          </View>
          {/* Sidebar */}
          <ScrollView
            style={styles.sidebar}
            contentContainerStyle={styles.sidebarContent}
            showsVerticalScrollIndicator={false}>
            {sidebarCategories.map(category => (
              <View
                key={category.id}
                style={styles.sidebarItem}
                onTouchEnd={() => handleSidebarClick(category.name)}>
                <Image
                  source={{uri: category.icon}}
                  style={styles.sidebarIcon}
                />
                <Text style={styles.sidebarText}>{category.name}</Text>
                <View style={styles.horizontalLine} />
              </View>
            ))}
          </ScrollView>
        </View>
        {/* Main Content */}
        {selectedSection === 'For You' && (
          <ScrollView style={styles.mainContent}>
            {/* Recently Viewed Stores */}
            <Text style={styles.sectionTitle}>Recently Viewed Stores</Text>
            <ScrollView
              horizontal
              style={styles.horizontalScroll}
              showsHorizontalScrollIndicator={false}>
              {recentlyViewed.map(item => (
                <View key={item.id} style={styles.recentItem}>
                  <Image
                    source={{uri: item.image}}
                    style={styles.recentImage}
                  />
                  <Text style={styles.recentText}>{item.name}</Text>
                </View>
              ))}
            </ScrollView>
            {/* More On Bismi Section */}
            <Text style={styles.sectionTitle}>More on Bismi</Text>
            <ScrollView
              horizontal
              style={styles.horizontalScroll}
              showsHorizontalScrollIndicator={false}>
              {bismi.map(item => (
                <View key={item.id} style={styles.recentItem}>
                  <Image
                    source={{uri: item.image}}
                    style={styles.roundedImage}
                  />
                  <Text style={styles.recentText}>{item.name}</Text>
                </View>
              ))}
            </ScrollView>
            {/* New Launch Section */}
            <Text style={styles.sectionTitle}>New Launch</Text>
            <ScrollView
              horizontal
              style={styles.horizontalScroll}
              showsHorizontalScrollIndicator={false}>
              {newLaunches.map(item => (
                <View key={item.id} style={styles.recentItem}>
                  <Image
                    source={{uri: item.image}}
                    style={styles.roundedImage}
                  />
                  <Text style={styles.recentText}>{item.name}</Text>
                </View>
              ))}
            </ScrollView>
            {/* Popular Stores */}
            <Text style={styles.sectionTitle}>Popular Stores</Text>
            <View style={styles.grid}>
              <ScrollView
                horizontal
                style={styles.horizontalScroll}
                showsHorizontalScrollIndicator={false}>
                {popularStores.map(store => (
                  <View key={store.id} style={styles.gridItem}>
                    <Image
                      source={{uri: store.image}}
                      style={styles.gridImage}
                    />
                    <View style={styles.gridText}>
                      <Text style={{fontWeight: 'bold', color: 'black'}}>
                        {store.name}
                      </Text>
                      <Text style={{color: 'black'}}>{store.price}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        )}
        {selectedSection === 'Fashion' && <CategoryForMens />}
      </View>
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
    // elevation: 2,
  },
  headers: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  headerTitle: {fontSize: 18, fontWeight: 'bold', color: '#fff'},
  headerIcons: {flexDirection: 'row', gap: 15},
  content: {flexDirection: 'row', flex: 1},
  sidebar: {
    backgroundColor: '#f5f5f5',
    width: 70, // Reduced the sidebar width to 60
    paddingVertical: 10,
    marginTop: 5,
    maxWidth: 70, // Ensures no width expansion beyond 60
  },
  sidebarContent: {
    paddingBottom: 10, // Ensure the content is scrollable
  },
  sidebarItem: {alignItems: 'center', marginBottom: 20},
  sidebarIcon: {width: 40, height: 40},
  sidebarText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    color: '#703F07',
  },
  mainContent: {flex: 1, padding: 10},
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#703F07',
  },
  grid: {flexDirection: 'row', flexWrap: 'wrap'},
  gridItem: {
    width: '30%',

    margin: '1.5%',
    backgroundColor: '#EDE0D4',
    borderRadius: 8,
    elevation: 2,
  },
  gridImage: {
    width: '100%',
    height: 60,
    resizeMode: 'cover',
  },
  gridText: {fontSize: 12, marginTop: 8, height: 45, marginLeft: 10},
  horizontalScroll: {marginVertical: 10},
  recentItem: {marginRight: 10, alignItems: 'center'},
  recentImage: {width: 80, height: 80, borderRadius: 8},
  recentText: {marginTop: 5, fontSize: 12, textAlign: 'center'},
  roundedImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  roundedImages: {
    width: 50,
    height: 50,
    borderRadius: 40,
  },
  //   sidebarContainer: {flex: 1},
  forYouSection: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forYouTitle: {
    fontSize: 12,
    marginBottom: 5,
    color: '#703F07',
  },
  horizontalLine: {
    width: '70%',
    height: 1,
    backgroundColor: '#703F07',
    marginTop: 10,
  },
});

export default Category;
