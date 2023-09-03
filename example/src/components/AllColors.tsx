import { View, Text, StyleSheet, Pressable, Modal, FlatList } from 'react-native';
import React, { useMemo, useState } from 'react';

import { useTheme } from '../styles/Theme';
import MaterialYou from 'react-native-material-you-colors';

import type { MaterialYouPalette } from 'react-native-material-you-colors';

const accents: (keyof MaterialYouPalette)[] = [
  'system_accent1',
  'system_accent2',
  'system_accent3',
  'system_neutral1',
  'system_neutral2',
];
const shades = [0, 10, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

export default function AllColors() {
  const theme = useTheme();

  const [visible, setVisible] = useState(false);

  const DATA = useMemo(() => {
    const palette = theme.seed
      ? MaterialYou.generatePaletteFromColor(theme.seed, theme.style)
      : MaterialYou.getMaterialYouPalette('#1b6ef3', theme.style);

    const listData = [];

    for (let a = 0; a < accents.length; a++) {
      const accent = accents[a]!; // 'system_accent1', 'system_accent2', 'system_accent3', 'system_neutral1', 'system_neutral2'

      for (let i = 0; i < shades.length; i++) {
        const shade = shades[i]!; // 0, 10, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000
        const color = palette[accent][i]!;
        listData.push({ name: `${accent}_${shade}`, color, shade });
      }
    }

    return listData;
  }, [theme]);

  const renderList = ({ item }: { item: { name: string; color: string; shade: number } }) => {
    return (
      <View style={[styles.shade, { backgroundColor: item.color }]}>
        <Text style={[styles.shadeTitle, { color: item.shade > 300 ? 'white' : 'black', marginBottom: 5 }]}>{item.name}</Text>
        <Text style={[styles.shadeTitle, { color: item.shade > 300 ? 'white' : 'black' }]}>{item.color}</Text>
      </View>
    );
  };

  return (
    <>
      <Pressable style={[styles.showButton, { backgroundColor: theme.primary }]} onPress={() => setVisible(true)}>
        <Text style={{ color: theme.textColored, fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Browse colors</Text>
      </Pressable>

      <Modal onRequestClose={() => setVisible(false)} visible={visible} animationType='slide' transparent>
        <FlatList data={DATA} renderItem={renderList} keyExtractor={(item, i) => item.name + i} />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  showButton: {
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
  shade: {
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadeTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});
