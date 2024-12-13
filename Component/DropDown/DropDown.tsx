//@ts-nocheck
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';

const Dropdown = ({ options, selectedValue, onValueChange }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleSelect = value => {
    setIsVisible(false);
    onValueChange(value);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsVisible(!isVisible)}>
        <Text style={styles.dropdownButtonText}>{selectedValue}</Text>
      </TouchableOpacity>
      {isVisible && (
        <Modal
          transparent
          animationType="fade"
          onRequestClose={() => setIsVisible(false)}>
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setIsVisible(false)}
          />
          <View style={styles.dropdownList}>
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelect(item)}>
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    justifyContent: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownList: {
    position: 'absolute',
    top: '50%',
    left: '10%',
    right: '10%',
    backgroundColor: '#fff',
    borderRadius: 5,
    maxHeight: 200,
    elevation: 5,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
});
export default Dropdown