import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import ColorPicker, { HueCircular, Preview, colorKit } from 'reanimated-color-picker';

import { useMaterialYouTheme } from '../styles/Theme';

import type { returnedResults } from 'reanimated-color-picker';

export default function ColorPickerWidget() {
  const theme = useMaterialYouTheme();

  const [visible, setVisible] = useState(false);

  let selectedColor = theme.seedColor === 'auto' ? theme.primary : theme.seedColor;

  selectedColor = colorKit.setSaturation(selectedColor, 100).hex();
  selectedColor = colorKit.setLuminance(selectedColor, 50).hex();

  const onColorSelect = (color: returnedResults) => {
    selectedColor = color.hex;
  };

  const onDonePress = () => {
    theme.setMaterialYouColor(selectedColor);
    setVisible(false);
  };

  return (
    <>
      <Pressable style={[styles.openButton, { backgroundColor: theme.primary }]} onPress={() => setVisible(true)}>
        <Text style={{ color: theme.textColored, fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Color Picker</Text>
      </Pressable>

      <Modal onRequestClose={() => setVisible(false)} visible={visible} animationType='fade' transparent>
        <Animated.View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={[styles.pickerContainer, { backgroundColor: theme.card }]}>
              <ColorPicker
                value={selectedColor}
                sliderThickness={25}
                thumbSize={24}
                thumbShape='pill'
                onComplete={onColorSelect}
                boundedThumb
              >
                <HueCircular containerStyle={{ justifyContent: 'center', alignItems: 'center', backgroundColor: theme.card }}>
                  <Preview
                    style={{ flex: 1, aspectRatio: 1, margin: 40, borderRadius: 500 }}
                    textStyle={{ fontSize: 18 }}
                    hideInitialColor
                  />
                </HueCircular>
              </ColorPicker>
            </View>
          </View>
          <View style={styles.doneButtonContainer}>
            <Pressable style={[styles.doneButton, { backgroundColor: theme.primary }]} onPress={onDonePress}>
              <Text style={{ color: theme.textColored, fontSize: 18, fontWeight: 'bold' }}>Done</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  pickerContainer: {
    alignSelf: 'center',
    width: 340,
    padding: 20,
    borderRadius: 500,
    marginTop: 60,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.0,
    elevation: 1,
  },

  openButton: {
    alignSelf: 'center',
    width: 300,
    borderRadius: 300,
    paddingHorizontal: 40,
    paddingVertical: 26,
    marginBottom: 60,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  doneButtonContainer: {
    flex: 0.2,
    justifyContent: 'center',
  },
  doneButton: {
    borderRadius: 60,
    paddingHorizontal: 60,
    paddingVertical: 20,
    alignSelf: 'center',
    backgroundColor: '#fff',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
