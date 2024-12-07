import React, { useEffect, useContext } from "react";
import { View, Text, FlatList, Image } from 'react-native'
import { pContext } from "../context/ProductContext";
import { getAllProducts } from "../Networking/HomePageService";
import Heart from '../assets/Heart.svg'


const ProductList = () => {

    const productContext = useContext(pContext)

    useEffect(() => {
        async function getProducts(params) {
            const productsListRespone = await getAllProducts(1)
            console.log(productsListRespone.data)
            if (productsListRespone.status == 200 && productsListRespone.data.code == 200) {
                productContext.updateProductList(productsListRespone.data.data.listAllProductItems)
            }
        }

        getProducts()
    }, [])

    return <View style={{ paddingLeft: 5, paddingRight: 5 }}>
        {
            productContext.productList.length > 0 && <FlatList data={productContext.productList} keyExtractor={item => item.id} numColumns={3} renderItem={({ item }) => {
                return <View style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 8 }}>
                    <Image source={{ uri: item.mainImage }} style={{ height: 180 }} />
                    <Text style={{ fontWeight: 700, marginTop: 8, color: '#000000' }} numberOfLines={1}>{item.product}</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', }}>
                        <View style={{ display: 'flex', flexDirection: 'column' }}>
                            <Text style={{ fontSize: 10, fontWeight: 600 }}>Casual Shirts</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 600, fontSize: 12, color: '#000000' }}>&#8377;{item.priceWithGst}</Text>
                                <Text style={{ fontSize: 8, fontWeight: 500, color: '#4E4E4E', marginLeft: 8, textDecorationLine: 'line-through' }}>&#8377;1200</Text>
                                <Text style={{ fontSize: 8, fontWeight: 500, color: '#CC2727', marginLeft: 8, textDecorationLine: 'line-through' }}>20% OFF</Text>
                            </View>
                        </View>
                        <Image source={Heart} style={{width: 50, height: 50}} />
                    </View>
                </View>
            }} />
        }


    </View>
}

export default ProductList;