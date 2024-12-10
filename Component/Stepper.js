//@ts-nocheck
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const VerticalStepperComponent = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleDotClick = (index) => {
    setCurrentStep(index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.stepContainer}>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepWrapper}>
            <View style={styles.stepIndicator}>
              <View
                style={[styles.dot, index <= currentStep && styles.activeDot]}
                onTouchEnd={() => handleDotClick(index)}
              />
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.line,
                    index < currentStep && styles.activeLine,
                  ]}
                />
              )}
            </View>
            <Text
              style={[
                styles.stepLabel,
                index === currentStep && styles.activeLabel,
              ]}
            >
              {step}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 10,
    padding: 15,
    maxWidth: 300, // Adjust width as per design needs
  },
  stepContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, // Adjust spacing between steps
  },
  stepIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
  },
  activeDot: {
    backgroundColor: 'green', // Color for active step
  },
  line: {
    width: 2,
    height: 70, // Length of the line between dots
    backgroundColor: '#e0e0e0',
    position: 'absolute',
    top: 20, // Adjust line to connect the dots
  },
  activeLine: {
    backgroundColor: 'green',
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#606060',
    marginLeft: 20, 
    lineHeight: 20, 
  },
  activeLabel: {
    color: 'green',
    fontWeight: '600', 
  },
});

export default VerticalStepperComponent;
