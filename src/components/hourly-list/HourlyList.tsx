import React from 'react';
import { FlatList, View, Text, Image } from 'react-native';
import { useSelector } from 'react-redux';

import { useTheme } from '@/constants/theme';

import { formatHour, formatTemp } from '../../utils/format';

import styles from './styles';

import type { HourlyEntry } from '../../features/weather/types';
import type { RootState } from '../../store/store';
import type { FC } from 'react';

type HourlyListProps = { hourly: HourlyEntry[] };

const HourlyList: FC<HourlyListProps> = ({ hourly }) => {
  const { colors } = useTheme();
  const units = useSelector((s: RootState) => s.weather.units);

  return (
    <FlatList
      data={hourly}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(it) => String(it.dt)}
      contentContainerStyle={styles.contentContainerStyle}
      renderItem={({ item }) => (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={{ color: colors.text, fontWeight: '600' }}>{formatHour(item.dt)}</Text>
          <Image
            source={{ uri: `https://openweathermap.org/img/wn/${item.icon}.png` }}
            style={styles.image}
          />
          <Text style={{ color: colors.sub }}>{formatTemp(item.temp, units)}</Text>
        </View>
      )}
    />
  );
};

export default HourlyList;
