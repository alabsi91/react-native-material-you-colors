import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useMaterialYouTheme } from '../styles/Theme';

type Props = {
  colors: [string, string];
  targetColor: string;
};
export default function PaletteButton({ colors, targetColor }: Props) {
  const theme = useMaterialYouTheme();

  const onPress = () => {
    theme.setMaterialYouColor(targetColor);
  };

  return (
    <Pressable style={[styles.container, { backgroundColor: colors[0] }]} onPress={onPress}>
      <View style={[styles.colored, { backgroundColor: colors[1] }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 1000,
    overflow: 'hidden',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.16,
    shadowRadius: 1.51,
    elevation: 2,
  },
  colored: {
    width: '50%',
    height: '50%',
    borderRadius: 200,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.0,
    elevation: 1,
  },
});
