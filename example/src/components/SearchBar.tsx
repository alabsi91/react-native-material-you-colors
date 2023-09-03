import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import { useTheme } from '../styles/Theme';

export default function SearchBar() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
        <Image
          style={[styles.icon, { tintColor: theme.icon }]}
          width={40}
          height={40}
          source={require('../assets/search.png')}
          tintColor={theme.icon}
        />
        <Text style={[styles.title, { color: theme.text }]}>Search for activities</Text>
      </View>
      <Image
        style={[styles.icon, { tintColor: theme.icon }]}
        width={48}
        height={48}
        source={require('../assets/mic.png')}
        tintColor={theme.icon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 16,

    marginHorizontal: 20,
    marginTop: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
