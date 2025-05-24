import React from 'react';
import { Alert, Image, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import MaterialYou from 'react-native-material-you-colors';

import BrowseColors from '../components/BrowseColors';
import Card from '../components/Card';
import ColorPickerWidget from '../components/ColorPickerWidget';
import PaletteButton from '../components/PaletteButton';
import SearchBar from '../components/SearchBar';
import { useMaterialYouTheme } from '../styles/Theme';
import StyleButton from '../components/StyleButton';

export default function Home() {
  const theme = useMaterialYouTheme();

  const getDevicePalette = () => {
    if (MaterialYou.isSupported) {
      theme.setMaterialYouColor('auto');
      return;
    }

    if (Platform.OS === 'web') {
      Alert.alert('"Material You" is not supported on this platform.');
      return;
    }

    if (Platform.OS === 'android') {
      Alert.alert('"Material You" is not supported on this device.');
      return;
    }

    Alert.alert('"Material You" is not supported on this platform.');
  };

  return (
    <>
      <StatusBar backgroundColor='transparent' barStyle={theme.isDark ? 'light-content' : 'dark-content'} translucent />

      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={styles.page}>
          <SearchBar />
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}>
            <Text style={[styles.title, { color: theme.text }]}>Recommended for you</Text>
            <Card />

            {/* Color Scheme */}
            <Text style={[styles.title, { color: theme.text }]}>Color Scheme</Text>
            <View style={styles.schemeContainer}>
              <Pressable
                style={styles.schemeButton}
                android_ripple={{ color: theme.primary, radius: 30 }}
                onPress={() => theme.setColorScheme('dark')}
              >
                <Image
                  style={[styles.icons, { tintColor: theme.icon }]}
                  width={48}
                  height={48}
                  source={require('../assets/dark_mode.png')}
                  tintColor={theme.icon}
                />
                <Text style={[styles.schemeButtonText, { color: theme.text }]}>Dark Mode</Text>
              </Pressable>
              <Pressable
                style={styles.schemeButton}
                android_ripple={{ color: theme.primary, radius: 30 }}
                onPress={() => theme.setColorScheme('light')}
              >
                <Image
                  style={[styles.icons, { tintColor: theme.icon }]}
                  width={48}
                  height={48}
                  source={require('../assets/light_mode.png')}
                  tintColor={theme.icon}
                />
                <Text style={[styles.schemeButtonText, { color: theme.text }]}>Light Mode</Text>
              </Pressable>
              <Pressable
                style={styles.schemeButton}
                android_ripple={{ color: theme.primary, radius: 30 }}
                onPress={() => theme.setColorScheme('auto')}
              >
                <Image
                  style={[styles.icons, { tintColor: theme.icon }]}
                  width={48}
                  height={48}
                  source={require('../assets/brightness_auto.png')}
                  tintColor={theme.icon}
                />
                <Text style={[styles.schemeButtonText, { color: theme.text }]}>Follow System</Text>
              </Pressable>
            </View>

            {/* Generate from a preset */}
            <Text style={[styles.title, { color: theme.text }]}>Generate from a preset</Text>
            <View style={styles.paletteContainer}>
              <PaletteButton targetColor='#ff0000' colors={['#FFB4A8', '#D8C2BE']} />
              <PaletteButton targetColor='#00ff00' colors={['#A5D395', '#C3C8BC']} />
              <PaletteButton targetColor='#0000ff' colors={['#BEC2FF', '#C7C5D0']} />
              <PaletteButton targetColor='#ef00ff' colors={['#E8B9D5', '#BEC2FF']} />
            </View>

            {/* Generate from a custom color */}
            <Text style={[styles.title, { color: theme.text }]}>Generate from a custom color</Text>
            <ColorPickerWidget />

            {/* Get Palette from the device */}
            <Text style={[styles.title, { color: theme.text }]}>Get Palette from the device</Text>
            <Pressable style={[styles.followSystemButton, { backgroundColor: theme.primary }]} onPress={getDevicePalette}>
              <Text style={{ color: theme.textColored, fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
                Follow system theme
              </Text>
            </Pressable>

            {/* View all the palette colors */}
            <Text style={[styles.title, { color: theme.text }]}>View all the palette colors</Text>
            <BrowseColors />

            {/* Palette generation style */}
            <Text style={[styles.title, { color: theme.text }]}>Palette generation style</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              <StyleButton styleName='CONTENT' />
              <StyleButton styleName='EXPRESSIVE' />
              <StyleButton styleName='FRUIT_SALAD' />
              <StyleButton styleName='MONOCHROMATIC' />
              <StyleButton styleName='RAINBOW' />
              <StyleButton styleName='SPRITZ' />
              <StyleButton styleName='TONAL_SPOT' />
              <StyleButton styleName='VIBRANT' />
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  paletteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    gap: 20,
    marginBottom: 60,
  },
  schemeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 60,
  },
  schemeButton: {
    alignItems: 'center',
    gap: 10,
  },
  schemeButtonText: {
    fontWeight: 'bold',
  },
  icons: {
    width: 34,
    height: 34,
  },
  followSystemButton: {
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
});
