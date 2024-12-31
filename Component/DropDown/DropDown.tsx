import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const DropdownComponent = ({
  data,
  labelField,
  valueField,
  placeholder,
  onChange,
  value,
  onFocus,
  onBlur,
  error,
}) => {
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    // Show label only if value is not selected and input is not focused
    if (!value && !isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: '#703F07' }]}>
          {placeholder || 'Select item'}
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
  
      <Dropdown
        style={[
          styles.dropdown,
          isFocus && { borderColor: '#703F07' },  // Change border color when focused
          error && !isFocus && { borderColor: 'red' },  // Change border color to red when error exists and not focused
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField={labelField || 'label'}
        valueField={valueField || 'value'}
        placeholder={!isFocus ? placeholder || 'Select item' : '...'}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => {
          setIsFocus(true);
          onFocus && onFocus();
        }}
        onBlur={() => {
          setIsFocus(false);
          onBlur && onBlur();
        }}
        onChange={item => {
          onChange(item[valueField || 'value']);
          setIsFocus(false);
        }}
      />
      {error && !isFocus ? (
        <Text style={styles.errorText}>{error}</Text>  // Show error text below the dropdown when not focused
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    // marginVertical: 10,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    paddingHorizontal: 8,
    marginVertical: 10,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default DropdownComponent;
