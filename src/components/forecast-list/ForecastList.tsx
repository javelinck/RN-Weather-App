import React from 'react';
import { FlatList, View, Text, Image } from 'react-native';
import { useSelector } from 'react-redux';

import { useTheme } from '@/constants/theme';

import { formatDay, formatTemp } from '../../utils/format';

import styles from './styles';

import type { DailyEntry } from '../../features/weather/types';
import type { RootState } from '../../store/store';
import type { FC } from 'react';

type ForecastListProps = { daily: DailyEntry[] };

const ForecastList: FC<ForecastListProps> = ({ daily }) => {
  const { colors } = useTheme();
  const units = useSelector((s: RootState) => s.weather.units);

  const keyExtractor = (item: DailyEntry) => item.date;
  const renderItem = ({ item }: { item: DailyEntry }) => {
    return (
      <View style={[styles.row, { backgroundColor: colors.card }]}>
        <View style={styles.rowItemWrapper}>
          <Text style={[styles.day, { color: colors.text }]}>{formatDay(item.date)}</Text>
        </View>
        <View style={[styles.rowItemWrapper, { alignItems: 'center' }]}>
          <Image
            source={{ uri: `https://openweathermap.org/img/wn/${item.icon}.png` }}
            style={{ width: 36, height: 36 }}
          />
        </View>
        <View style={[styles.rowItemWrapper, { alignItems: 'center' }]}>
          <Text style={[styles.temp, { color: colors.sub }]}>
            {formatTemp(item.low, units)} / {formatTemp(item.high, units)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={daily}
      scrollEnabled={false}
      keyExtractor={keyExtractor}
      contentContainerStyle={{ paddingVertical: 8 }}
      renderItem={renderItem}
    />
  );
};

export default ForecastList;
