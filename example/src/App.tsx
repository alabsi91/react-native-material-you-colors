import React from 'react';
import { FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import MaterialYouColors from 'react-native-material-you-colors';

const shades = [0, 10, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

export default function App() {
  // const palette = MaterialYouColors.getMaterialYouPalette('#009dff');
  const palette = MaterialYouColors.generatePaletteFromColor('#ff00ff', 'VIBRANT');

  const listData = [
    ...palette.system_accent1.map((e, i) => ({
      name: `system_accent1_${shades[i]}`,
      color: e,
      shade: shades[i] as number,
    })),
    ...palette.system_accent2.map((e, i) => ({
      name: `system_accent2_${shades[i]}`,
      color: e,
      shade: shades[i] as number,
    })),
    ...palette.system_accent3.map((e, i) => ({
      name: `system_accent3_${shades[i]}`,
      color: e,
      shade: shades[i] as number,
    })),
    ...palette.system_neutral1.map((e, i) => ({
      name: `system_neutral1_${shades[i]}`,
      color: e,
      shade: shades[i] as number,
    })),
    ...palette.system_neutral2.map((e, i) => ({
      name: `system_neutral2_${shades[i]}`,
      color: e,
      shade: shades[i] as number,
    })),
  ];

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
    borderColor: 'gray',
    borderWidth: 0.2,
  },
  shadeTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});
