import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FilterPage = ({route, navigation}) => {
  const {productsData, applyFilter} = route.params;
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [activeSection, setActiveSection] = useState('size');

  const brands = ['Nike', 'Adidas', 'Puma', 'Reebok'];
  const sizes = ['S', 'M', 'L', 'XL'];

  const handleBrandSelection = brand => {};

  const handleSizeSelection = size => {};

  const handleMinPriceChange = value => {
    setMinPrice(value);
  };

  const handleMaxPriceChange = value => {
    setMaxPrice(value);
  };

  const applySelectedFilter = () => {
    // let filteredShirts = shirtsData;

    // if (selectedBrands.length > 0) {
    //   filteredShirts = filteredShirts.filter(shirt =>
    //     selectedBrands.includes(shirt.brand),
    //   );
    // }

    // if (selectedSizes.length > 0) {
    //   filteredShirts = filteredShirts.filter(shirt =>
    //     selectedSizes.includes(shirt.size),
    //   );
    // }

    // filteredShirts = filteredShirts.filter(
    //   shirt => shirt.price >= minPrice && shirt.price <= maxPrice,
    // );

    applyFilter([]);
    navigation.goBack();
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedSizes([]);
    setMinPrice(0);
    setMaxPrice(1000);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 10,
        }}>
        <View style={{flexDirection: 'row'}}>
          <Icon name="filter-outline" size={28} color="black" />
          <Text style={styles.title}>Filters</Text>
        </View>

        <Text style={styles.clearAllText} onPress={clearFilters}>
          Clear All
        </Text>
      </View>
      <View style={{flexDirection: 'row', flex: 1}}>
        <View style={styles.sidebar}>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <TouchableOpacity
              style={[
                styles.sidebarItem,
                activeSection === 'brand' && styles.filters,
              ]}
              onPress={() =>
                setActiveSection(activeSection === 'brand' ? null : 'brand')
              }>
              <Text style={styles.filterHeading}>Brand</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sidebarItem,
                activeSection === 'size' && styles.filters,
              ]}
              onPress={() =>
                setActiveSection(activeSection === 'size' ? null : 'size')
              }>
              <Text style={styles.filterHeading}>Size</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sidebarItem,
                activeSection === 'price' && styles.filters,
              ]}
              onPress={() =>
                setActiveSection(activeSection === 'price' ? null : 'price')
              }>
              <Text style={styles.filterHeading}>Price</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.mainContent}>
          {activeSection === 'brand' && (
            <View>
              <FlatList
                data={brands}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      selectedBrands.includes(item) && styles.selectedOption,
                    ]}
                    onPress={() => handleBrandSelection(item)}>
                    <Text style={styles.filterText}>{item}</Text>
                    <Icon
                      name={
                        selectedBrands.includes(item)
                          ? 'checkbox-marked'
                          : 'checkbox-blank'
                      }
                      size={24}
                      color={selectedBrands.includes(item) ? '#703F07' : 'gray'}
                    />
                  </TouchableOpacity>
                )}
                keyExtractor={item => item}
              />
            </View>
          )}

          {activeSection === 'size' && (
            <View>
              <FlatList
                data={sizes}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      selectedSizes.includes(item) && styles.selectedOption,
                    ]}
                    onPress={() => handleSizeSelection(item)}>
                    <Text style={styles.filterText}>{item}</Text>
                    <Icon
                      name={
                        selectedSizes.includes(item)
                          ? 'checkbox-marked'
                          : 'checkbox-blank'
                      }
                      size={24}
                      color={selectedSizes.includes(item) ? '#703F07' : 'gray'}
                    />
                  </TouchableOpacity>
                )}
                keyExtractor={item => item}
              />
            </View>
          )}

          {activeSection === 'price' && (
            <View style={styles.sliderContainer}>
              <Text style={styles.priceText}>
                {minPrice} - {maxPrice}
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1000}
                step={10}
                value={minPrice}
                onValueChange={handleMinPriceChange}
                minimumTrackTintColor="#703F07"
                maximumTrackTintColor="#ccc"
              />
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1000}
                step={10}
                value={maxPrice}
                onValueChange={handleMaxPriceChange}
                minimumTrackTintColor="#703F07"
                maximumTrackTintColor="#ccc"
              />
            </View>
          )}
        </View>
      </View>

      <View style={styles.applyButtonContainer}>
        <TouchableOpacity onPress={applySelectedFilter}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity onPress={applySelectedFilter}>
          <Text style={styles.buttonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  sidebar: {
    width: '30%',
    backgroundColor: '#EDE0D4',
    height: '100%',
    flexDirection: 'column',
  },

  filters: {
    backgroundColor: 'white',
  },
  sidebarItem: {
    backgroundColor: '#EDE0D4',
  },
  mainContent: {
    flex: 1,
    width: '70%',
    padding: 15,
    backgroundColor: '#fff',
  },
  icon: {},
  title: {fontSize: 20, marginBottom: 10, color: 'black'},
  filterHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
    marginLeft: 20,
  },
  clearAllText: {
    textDecorationLine: 'underline',
    textDecorationColor: 'black',
    color: 'gray',
    fontSize: 20,
  },
  filterOption: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#e0e0e0',
  },
  filterText: {fontSize: 16},
  sliderContainer: {
    marginVertical: 20,
  },
  priceText: {
    fontSize: 16,
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
    marginVertical: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },

  applyButtonContainer: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    backgroundColor: '#703F07',
    padding: 10,
  },
  divider: {
    width: 2,
    height: '100%',
    backgroundColor: '#ddd',
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default FilterPage;
