import React, {useEffect, useContext, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {pContext} from '../Context/ProductContext';
import {getAllProducts} from '../Networking/HomePageService';
import Heart from '../assets/Heart.svg';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {UserContext} from '../Context/UserContext';
import FilterPage from './ProductList/Filter';
const ProductList = () => {
  const productContext = useContext(pContext);
  const userContext = useContext(UserContext);
  const [sortVisible, setSortVisible] = useState(false); // State for Sort Modal
  const [filterVisible, setFilterVisible] = useState(false); // State for Sort Modal
  const [selectedSort, setSelectedSort] = useState(null);
  let [sortedData, setSortedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [filterProductRange, setFilterProductRange] = useState(null);
  let userInfo = userContext?.user;
  const navigation = useNavigation();
  const route = useRoute();
  const {categoryId} = route.params;
  useEffect(() => {
    async function getProducts(params) {
      const productsListRespone = await getAllProducts(
        categoryId,
        userInfo?.id,
      );
      console.log(productsListRespone.data);
      if (
        productsListRespone.status == 200 &&
        productsListRespone.data.code == 200
      ) {
        productContext.updateProductList(
          productsListRespone.data.data.listAllProductItems,
        );
      }
    }

    getProducts();
  }, []);
  const handleSortOptionSelect = option => {
    setSelectedSort(option);
    setSortVisible(false); // Close modal after selecting
    let sorted_data = [];
    if (option === 'Low Price') {
      sorted_data = productContext.productList.sort(
        (a, b) => a.unitPrice - b.unitPrice,
      );
    } else if (option === 'High Price') {
      sorted_data = productContext.productList.sort(
        (a, b) => b.unitPrice - a.unitPrice,
      );
    } else if (option === 'Popularity') {
      sorted_data = productContext.productList.sort(
        (a, b) => b.rating - a.rating,
      );
    }
    setSortedData(sorted_data);
  };
  const handleFilterApply = filtered_data => {
    setFilteredData(filtered_data);
    setFilterVisible(false);
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
  let productsToRender = selectedSort
    ? sortedData
    : productContext?.productList;
  let filtered_products = filterProductRange ? filteredData : productsToRender;
  const renderFilterModal = () => (
    <Modal
      transparent
      animationType="slide"
      visible={filterVisible}
      onRequestClose={() => setFilterVisible(false)}>
      <FilterPage
        filterProductRange={filterProductRange}
        setFilterProductRange={setFilterProductRange}
        applyFilter={handleFilterApply}
        productsData={productsToRender}
        setFilterVisible={setFilterVisible}
        navigation={navigation}
      />
    </Modal>
  );
  return (
    <View style={{flex: 1}}>
      <ScrollView style={styles.container}>
        {/* <Text>{JSON.stringify(productContext.productList, null, 2)}</Text> */}
        <View style={styles.header}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="arrow-left"
              size={24}
              color="#fff"
              onPress={() => navigation.navigate('home')}
            />
            <Text style={styles.headerTitle}>Product List</Text>
          </View>

          <View style={styles.headerIcons}>
            <Icon name="magnify" size={24} color="#fff" />
            <Icon
              name="cart"
              size={24}
              color="#fff"
              onPress={() => navigation.navigate('Cart')}
            />
          </View>
        </View>
        <View style={{paddingLeft: 5, paddingRight: 5}}>
          {filtered_products?.length > 0 ? (
            <FlatList
              data={productContext.productList}
              keyExtractor={item => item.id}
              numColumns={3}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      padding: 8,
                    }}
                    onPress={() =>
                      navigation.navigate('ProductListView', {
                        selectedItem: item,
                        similarItem: productContext?.productList?.filter(
                          otherItem => otherItem?.id !== item?.id,
                        ),
                      })
                    }>
                    <Image
                      source={{uri: item.mainImage}}
                      style={{height: 180}}
                    />
                    <Text
                      style={{fontWeight: 700, marginTop: 8, color: '#000000'}}
                      numberOfLines={1}>
                      {item.product}
                    </Text>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                      <View style={{display: 'flex', flexDirection: 'column'}}>
                        {/* <Text style={{fontSize: 10, fontWeight: 600}}>
                        Casual Shirts
                      </Text> */}
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text
                            style={{
                              fontWeight: 600,
                              fontSize: 12,
                              color: '#000000',
                            }}>
                            &#8377;{item.priceWithGst}
                          </Text>
                          <Text
                            style={{
                              fontSize: 8,
                              fontWeight: 500,
                              color: '#4E4E4E',
                              marginLeft: 8,
                              textDecorationLine: 'line-through',
                            }}>
                            &#8377;1200
                          </Text>
                          <Text
                            style={{
                              fontSize: 8,
                              fontWeight: 500,
                              color: '#CC2727',
                              marginLeft: 8,
                              textDecorationLine: 'line-through',
                            }}>
                            20% OFF
                          </Text>
                        </View>
                      </View>
                      <Image source={Heart} style={{width: 50, height: 50}} />
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          ) : filterProductRange ? (
            <View style={{flex: 1, margin: 12}}>
              <Text
                style={{
                  padding: 12,
                  textAlign: 'center',
                  borderWidth: 1,
                  borderStyle: 'dashed',
                }}>
                No products available for this applied filter
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={{flexDirection: 'row', gap: 5}}
          onPress={
            () => {
              setFilterVisible(true);
            }
            // navigation.navigate('FilterPage', {
            //   productList:productContext?.productList,
            //   applyFilter: handleFilterApply,
            // })
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
      {renderFilterModal()}
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
export default ProductList;
