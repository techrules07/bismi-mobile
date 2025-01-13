import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
const FAQsScreen = () => {
  const [expanded, setExpanded] = useState(null);

  const faqs = [
    {
      question: 'What is the return policy?',
      answer:
        'Our return policy allows you to return items within 30 days of purchase. Please ensure the product is unused and in original packaging.',
    },
    {
      question: 'How do I contact customer support?',
      answer:
        'You can reach out to customer support via email at support@company.com or call us at 123-456-7890.',
    },
    {
      question: 'Where are your products manufactured?',
      answer:
        'Our products are manufactured in the USA, using high-quality materials sourced from local suppliers.',
    },
  ];

  const toggleDetails = index => {
    setExpanded(prev => (prev === index ? null : index)); // Toggle the expanded state
  };
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icons
            name="arrow-left"
            size={24}
            color="#fff"
            onPress={() => navigation.navigate('Account')}
          />
          <Text style={styles.headerTitle}>FAQS</Text>
        </View>

        <View style={styles.headerIcons}>
          {/* <Icons name="magnify" size={24} color="#fff" /> */}
          <Icons
            name="cart"
            size={24}
            color="#fff"
            onPress={() => navigation.navigate('Cart')}
          />
        </View>
      </View>
      <View style={styles.Cards}>
        <Text
          style={{
            fontWeight: 'bold',
            color: '#703F07',
            fontSize: 16,
          }}>
          How do we help you for our products in Bismi?
        </Text>
        <Text style={{marginTop: 10}}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, quia
          eligendi consequatur temporibus voluptate aperiam aut, similique nisi
          omnis optio iste illo, ducimus cupiditate iusto! Eum provident sequi
          voluptate voluptatem.
        </Text>
      </View>
      <View style={styles.card}>
        <Text
          style={{
            fontWeight: 'bold',
            color: '#703F07',
            fontSize: 16,
            marginLeft: 10,
          }}>
          FAQ
        </Text>
        {faqs.map((faq, index) => (
          <View key={index} style={{padding: 10}}>
            <View style={styles.cardHeader}>
              <Text style={styles.question}>{faq.question}</Text>
              <TouchableOpacity onPress={() => toggleDetails(index)}>
                <MaterialIcons
                  name={expanded === index ? 'close' : 'add'}
                  size={24}
                  color="#703F07"
                />
              </TouchableOpacity>
            </View>
            {expanded === index && (
              <Text style={styles.answer}>{faq.answer}</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    // padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
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
  Cards: {
    backgroundColor: '#fff',
    marginBottom: 15,
    // borderRadius: 8,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 5,
    // borderRadius: 8,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  answer: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});

export default FAQsScreen;
