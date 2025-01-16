//@ts-nocheck
import React, { useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {MaterialIcons} from 'react-native-vector-icons/MaterialCommunityIcons'; 


const CustomerReviews = ({reviews}) => {
  console.log('reviews', reviews);
  const [visibleReviews, setVisibleReviews] = useState(5);
  const handleViewMore = () => {
    setVisibleReviews(prevVisibleReviews => prevVisibleReviews + 5);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Reviews</Text>

      <ScrollView style={styles.reviewContainer}>
        {reviews && reviews?.length > 0 ? (
          reviews?.slice(0, visibleReviews)?.map(item => (
            <View key={item?.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.username}>{item?.username}</Text>
                <View style={styles.stars}>
                </View>
                <Text style={styles.score}>{item?.score || null}</Text>
              </View>
              <Text style={styles.comment}>{item?.comments || null}</Text>
              <View style={styles.footer}>
                <MaterialIcons name="check-circle" size={16} color="black" />
                <Text style={styles.footerText}>
                  Certified Buyer, 29 April, 2023
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noReviewsText}>No reviews available</Text>
        )}
      </ScrollView>

      {reviews && visibleReviews < reviews?.length && (
        <View style={styles.viewMoreButtonContainer}>
          <TouchableOpacity
            onPress={handleViewMore}
            style={styles.viewMoreButton}>
            <Text style={styles.viewMoreButtonText}>View More</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Quicksand',
    fontWeight: '600',
    color: '#78350f',
    marginBottom: 16,
  },
  reviewContainer: {
    maxHeight: 600,
    overflowY: 'auto',
  },
  reviewCard: {
    flexDirection: 'column',
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4e2a00',
    marginRight: 8,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  score: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b6b6b',
  },
  comment: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#6b6b6b',
  },
  noReviewsText: {
    textAlign: 'center',
    color: '#888',
  },
  viewMoreButtonContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  viewMoreButton: {
    backgroundColor: '#78350f',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  viewMoreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomerReviews;
