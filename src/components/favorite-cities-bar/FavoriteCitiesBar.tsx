import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';

import { useTheme } from '@/constants/theme';

import styles from './styles';

import type { FC } from 'react';

type FavoriteCitiesBarProps = {
  cities: string[];
  onSelect: (c: string) => void;
  onRemove: (c: string) => void;
};

const FavoriteCitiesBar: FC<FavoriteCitiesBarProps> = ({ cities, onSelect, onRemove }) => {
  const { colors } = useTheme();

  if (!cities.length) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 6 }}
    >
      {cities.map((city) => {
        const handleRemove = () => onRemove(city);
        const handleSelect = () => onSelect(city);

        return (
          <View key={city} style={[styles.chip, { backgroundColor: colors.card }]}>
            <Pressable onPress={handleSelect}>
              <Text style={{ color: colors.text, fontWeight: '600' }}>{city}</Text>
            </Pressable>
            <Pressable onPress={handleRemove}>
              <Text style={{ color: colors.danger, marginLeft: 8 }}>✕</Text>
            </Pressable>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default FavoriteCitiesBar;
