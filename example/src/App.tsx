import React, { useMemo } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import MaterialYouColors from 'react-native-material-you-colors';

import type { MaterialYouPalette } from 'react-native-material-you-colors';

const accents: (keyof MaterialYouPalette)[] = [
  'system_accent1',
  'system_accent2',
  'system_accent3',
  'system_neutral1',
  'system_neutral2',
];
const shades = [0, 10, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

export default function App() {
  const palette = MaterialYouColors.getMaterialYouPalette('#009dff');
  // const palette = MaterialYouColors.generatePaletteFromColor('#009dff', 'VIBRANT');

  // generate flatList data
  const listData = useMemo(() => {
    const data = [];

    for (let a = 0; a < accents.length; a++) {
      const accent = accents[a]!; // 'system_accent1', 'system_accent2', 'system_accent3', 'system_neutral1', 'system_neutral2'

      for (let i = 0; i < shades.length; i++) {
        const shade = shades[i]!; // 0, 10, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000
        const color = palette[accent][i]!;
        data.push({ name: `${accent}_${shade}`, color, shade });
      }
    }

    return data;
  }, [palette]);

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
      <StatusBar backgroundColor={palette.system_accent1[8]} />
      <FlatList data={listData} renderItem={renderList} keyExtractor={(item, i) => item.name + i} />
    </>
  );
}

const styles = StyleSheet.create({
  shade: {
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    // borderColor: 'gray',
    // borderTopWidth: 2,
    // borderBottomWidth: 2,
  },
  shadeTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});
