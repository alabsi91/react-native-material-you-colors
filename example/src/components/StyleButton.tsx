import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useMaterialYouTheme } from '../styles/Theme';

import type { GenerationStyle } from 'react-native-material-you-colors';

export default function StyleButton({ styleName }: { styleName: GenerationStyle }) {
  const theme = useMaterialYouTheme();

  const onButtonPress = () => {
    theme.setPaletteStyle(styleName);
  };
  return (
    <Pressable
      style={[styles.styleButton, { backgroundColor: theme.style === styleName ? theme.card : theme.primary }]}
      onPress={onButtonPress}
    >
      <Text style={[styles.styleButtonText, { color: theme.style === styleName ? theme.text : theme.textColored }]}>
        {styleName.replace('_', ' ')}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  styleButton: {
    borderRadius: 300,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: 'transparent',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  styleButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
