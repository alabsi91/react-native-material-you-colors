import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';
import ColorPicker, { HueSlider, Panel1, PreviewText, Swatches, colorKit } from 'reanimated-color-picker';

import { useTheme } from '../styles/Theme';

import type { returnedResults } from 'reanimated-color-picker';

export default function ColorPickerWidget() {
  const theme = useTheme();

  const [visible, setVisible] = useState(false);

  const customSwatches = new Array(6).fill('#fff').map(() => colorKit.randomRgbColor().hex());
  const selectedColor = useSharedValue(customSwatches[0]!);

  const onColorSelect = (color: returnedResults) => {
    selectedColor.value = color.hex;
  };

  const onDonePress = () => {
    theme.setMaterialYouColor(selectedColor.value);
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
                value={theme.seed ?? theme.primary}
                sliderThickness={25}
                thumbSize={24}
                thumbShape='circle'
                onComplete={onColorSelect}
                boundedThumb
              >
                <Panel1 style={styles.panelStyle} />
                <HueSlider style={styles.sliderStyle} />
                <Swatches
                  style={[styles.swatchesContainer, { borderColor: theme.primary }]}
                  swatchStyle={styles.swatchStyle}
                  colors={customSwatches}
                />
                <View style={[styles.previewTxtContainer, { borderColor: theme.primary }]}>
                  <PreviewText style={{ color: theme.text }} />
                </View>
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
    width: 300,
    padding: 20,
    borderRadius: 20,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.16,
    shadowRadius: 1.51,
    elevation: 2,
  },
  panelStyle: {
    borderRadius: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  sliderStyle: {
    borderRadius: 20,
    marginTop: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  previewTxtContainer: {
    paddingTop: 20,
    marginTop: 20,
    borderTopWidth: 1,
  },
  swatchesContainer: {
    paddingTop: 20,
    marginTop: 20,
    borderTopWidth: 1,
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: 10,
  },
  swatchStyle: {
    borderRadius: 20,
    height: 30,
    width: 30,
    margin: 0,
    marginBottom: 0,
    marginHorizontal: 0,
    marginVertical: 0,
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
    borderRadius: 30,
    paddingHorizontal: 60,
    paddingVertical: 10,
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
