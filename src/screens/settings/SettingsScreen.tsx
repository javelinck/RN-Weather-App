import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';

import { useTheme } from '@/constants/theme';
import ThemeButton from '@/src/screens/settings/components/ThemeButton';
import UnitButton from '@/src/screens/settings/components/UnitButton';
import { makeStyles } from '@/src/screens/settings/styles';

import { removeFavorite } from '../../features/weather/weather.slice';

import type { RootState } from '../../store/store';
import type { ThemeColors } from '@/src/screens/settings/styles';

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const { favorites } = useSelector((s: RootState) => s.weather);
  const { colors } = useTheme();

  const themedStyles = makeStyles(colors as ThemeColors);

  return (
    <SafeAreaView style={[themedStyles.safe, { backgroundColor: colors.bg }]}>
      <View style={themedStyles.container}>
        <Text style={[themedStyles.title, { color: colors.text }]}>Settings</Text>

        <Text style={[themedStyles.section, { color: colors.text }]}>Units</Text>
        <View style={themedStyles.row}>
          <UnitButton label="°C" value="metric" />
          <UnitButton label="°F" value="imperial" />
        </View>

        <Text style={[themedStyles.section, { color: colors.text }]}>Theme</Text>
        <View style={themedStyles.row}>
          <ThemeButton label="System" value="system" />
          <ThemeButton label="Light" value="light" />
          <ThemeButton label="Dark" value="dark" />
        </View>

        <Text style={[themedStyles.section, { color: colors.text }]}>Favorites</Text>
        {favorites.length === 0 ? (
          <Text style={{ color: colors.sub }}>No favorites yet</Text>
        ) : (
          favorites.map((c) => (
            <View key={c} style={themedStyles.favoriteRow}>
              <Text style={{ color: colors.text }}>{c}</Text>
              <Pressable onPress={() => dispatch(removeFavorite(c))}>
                <Text style={{ color: colors.danger }}>Remove</Text>
              </Pressable>
            </View>
          ))
        )}
      </View>
    </SafeAreaView>
  );
}
