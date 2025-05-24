import React from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { useMaterialYouTheme } from '../styles/Theme';

export default function Card() {
  const theme = useMaterialYouTheme();

  const onButtonPress = () => {
    Linking.openURL('https://m3.material.io/styles/color/dynamic-color/overview').catch(console.error);
  };

  return (
    <View style={styles.card}>
      <Image
        style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
        width={2400}
        height={2400}
        source={require('../assets/material_design.jpg')}
        resizeMode='cover'
      />

      <View style={{ height: 200, justifyContent: 'center' }}>
        <Text style={styles.title}>Material Design</Text>
      </View>

      <View style={[styles.infoContainer, { backgroundColor: theme.card }]}>
        <Text style={[styles.infoText, { color: theme.text }]}>
          Material 3 is the latest version of Google’s open-source design system. Design and build beautiful, usable products with
          Material 3.
        </Text>

        <Pressable style={[styles.button, { backgroundColor: theme.primary }]} onPress={onButtonPress}>
          <Text style={[styles.buttonText, { color: theme.textColored }]}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexShrink: 1,
    position: 'relative',
    alignSelf: 'center',
    borderRadius: 36,
    marginBottom: 60,
    overflow: 'hidden',
  },
  title: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: 34,
    padding: 20,
  },
  infoContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 30,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});
