import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { useTheme } from '@/constants/theme';
import { addFavorite } from '@/src/features/weather/weather.slice';

import { formatTemp, formatWind } from '../../utils/format';

import styles from './styles';

import type { CurrentWeather } from '../../features/weather/types';
import type { RootState } from '../../store/store';
import type { FC } from 'react';

type WeatherCardProps = { current: CurrentWeather };

const WeatherCard: FC<WeatherCardProps> = ({ current }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const units = useSelector((s: RootState) => s.weather.units);
  const op = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(op.current, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [current.dt, op]);

  return (
    <Animated.View style={[styles.card, { backgroundColor: colors.card, opacity: op.current }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.city, { color: colors.text }]}>{current.name}</Text>
          <Text style={[styles.desc, { color: colors.sub }]}>{current.description}</Text>
        </View>

        <Pressable onPress={() => dispatch(addFavorite(current.name))}>
          <Text style={{ color: colors.tint }}>+ Favorite</Text>
        </Pressable>
      </View>
      <View style={styles.row}>
        <Image
          source={{ uri: `https://openweathermap.org/img/wn/${current.icon}@2x.png` }}
          style={styles.image}
        />
        <View>
          <Text style={[styles.temp, { color: colors.text }]}>
            {formatTemp(current.temp, units)}
          </Text>
          <Text style={{ color: colors.sub }}>
            💧 {current.humidity}% 🌬️ {formatWind(current.wind, units)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default WeatherCard;
