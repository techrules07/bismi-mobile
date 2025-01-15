// //@ts-nocheck
// import React, { useState } from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// const VerticalStepperComponent = ({ steps }) => {
//   const [currentStep, setCurrentStep] = useState(0);

//   const handleDotClick = (index) => {
//     setCurrentStep(index);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.stepContainer}>
//         {steps.map((step, index) => (
//           <View key={index} style={styles.stepWrapper}>
//             <View style={styles.stepIndicator}>
//               <View
//                 style={[styles.dot, index <= currentStep && styles.activeDot]}
//                 onTouchEnd={() => handleDotClick(index)}
//               />
//               {index < steps.length - 1 && (
//                 <View
//                   style={[
//                     styles.line,
//                     index < currentStep && styles.activeLine,
//                   ]}
//                 />
//               )}
//             </View>
//             <View style={styles.stepContent}>
//               <Text
//                 style={[
//                   styles.stepLabel,
//                   index === currentStep && styles.activeLabel,
//                 ]}
//               >
//                 {step.label}
//               </Text>
//               {step.value && (
//                 <Text style={styles.stepValue}>{step.value}</Text>
//               )}
//             </View>
//           </View>
//         ))}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     margin: 10,
//     padding: 15,
//     maxWidth: 300, // Adjust width as per design needs
//   },
//   stepContainer: {
//     flexDirection: 'column',
//     justifyContent: 'center',
//   },
//   stepWrapper: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 30, // Adjust spacing between steps
//   },
//   stepIndicator: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     position: 'relative',
//     marginRight: 10, // Space between dot and content
//   },
//   dot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: '#e0e0e0',
//   },
//   activeDot: {
//     backgroundColor: 'green', // Color for active step
//   },
//   line: {
//     width: 2,
//     height: 70, // Length of the line between dots
//     backgroundColor: '#e0e0e0',
//     position: 'absolute',
//     top: 10, // Adjust line to connect the dots
//   },
//   activeLine: {
//     backgroundColor: 'green',
//   },
//   stepContent: {
//     flex: 1,
//   },
//   stepLabel: {
//     fontSize: 16,
//     fontWeight: '400',
//     color: '#606060',
//     lineHeight: 20,
//   },
//   activeLabel: {
//     color: 'green',
//     fontWeight: '600',
//   },
//   stepValue: {
//     fontSize: 14,
//     color: '#909090',
//     marginTop: 4,
//   },
// });

// export default VerticalStepperComponent;
//@ts-nocheck
import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';

const VerticalStepperComponent = ({steps}) => {
  const [currentStep, setCurrentStep] = useState(2);

  return (
    <View style={styles.container}>
      <ProgressSteps
        activeStep={currentStep}
        activeStepIconBorderColor="#4caf50"
        completedProgressBarColor="#4caf50"
        completedStepIconColor="#4caf50"
        activeLabelColor="#4caf50"
        disabledStepIconColor="#e0e0e0"
        progressBarColor="#e0e0e0"
        topOffset={20}
        style={styles.progressSteps}>
        {steps?.map((step, index) => (
          <ProgressStep key={index} label={step.label} removeBtnRow>
            <View style={styles.stepContent}>
              <Text style={styles.stepText}>{step?.content}</Text>
            </View>
          </ProgressStep>
        ))}
      </ProgressSteps>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  progressSteps: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
  },
  stepContent: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  stepText: {
    fontSize: 16,
    color: '#606060',
  },
});

export default VerticalStepperComponent;
