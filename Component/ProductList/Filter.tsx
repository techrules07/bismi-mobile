import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FilterPage = (props: any) => {
  const {
    productsData,
    applyFilter,
    navigation,
    filterProductRange,
    setFilterProductRange,
  } = props;
  // const [selectedPriceRange, setSelectedPriceRange] = useState('');

  const applySelectedFilter = () => {
    let filteredProducts = productsData;

    if (filterProductRange) {
      filteredProducts = filteredProducts.filter((product: any) => {
        if (filterProductRange === 'below2000') return product.unitPrice < 2000;
        if (filterProductRange === '2000to5000')
          return product.price >= 2000 && product.unitPrice <= 5000;
        if (filterProductRange === 'above5000') return product.unitPrice > 5000;
        return true;
      });
    }

    applyFilter(filteredProducts);
  };

  const clearFilters = () => {
    setFilterProductRange(null);
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

      <View style={styles.mainContent}>
        <ScrollView>
          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => setFilterProductRange('below2000')}>
            <Text
              style={[
                styles.filterText,
                filterProductRange === 'below2000' && styles.selectedOption,
              ]}>
              Below 2000
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => setFilterProductRange('2000to5000')}>
            <Text
              style={[
                styles.filterText,
                filterProductRange === '2000to5000' && styles.selectedOption,
              ]}>
              2000 - 5000
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => setFilterProductRange('above5000')}>
            <Text
              style={[
                styles.filterText,
                filterProductRange === 'above5000' && styles.selectedOption,
              ]}>
              More than 5000
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.applyButtonContainer}>
        <TouchableOpacity onPress={clearFilters}>
          <Text style={styles.buttonText}>Clear</Text>
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
  mainContent: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  title: {fontSize: 20, marginBottom: 10, color: 'black'},
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
  },
  selectedOption: {
    fontWeight: 'bold',
    color: '#703F07',
  },
  filterText: {fontSize: 16},
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
