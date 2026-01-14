import React from 'react';
import { View, Text, RefreshControl, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/constants/theme';
import { useHomeScreenLogic } from '@/src/screens/home/useHomeScreenLogic';

import FavoriteCitiesBar from '../../components/favorite-cities-bar/FavoriteCitiesBar';
import ForecastList from '../../components/forecast-list/ForecastList';
import HourlyList from '../../components/hourly-list/HourlyList';
import SearchBar from '../../components/search-bar/SearchBar';
import WeatherCard from '../../components/weather-card/WeatherCard';

import styles from './styles';

export default function HomeScreen() {
  const { colors } = useTheme();
  const {
    data,
    loading,
    errMsg,
    favorites,
    handleRemoveFavorite,
    onSearch,
    onRefresh,
    handleTriggerCity,
  } = useHomeScreenLogic();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
            tintColor={colors.text}
            titleColor={colors.text}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text }]}>Weather</Text>

        <SearchBar onSubmit={onSearch} loading={loading} />
        <FavoriteCitiesBar
          cities={favorites}
          onSelect={handleTriggerCity}
          onRemove={handleRemoveFavorite}
        />

        {loading && !data && (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
          </View>
        )}

        {!loading && errMsg && !data && (
          <View style={styles.center}>
            <Text style={{ color: colors.danger }}>{errMsg}</Text>
          </View>
        )}

        {data && (
          <View style={{ gap: 12 }}>
            <WeatherCard current={data.current} />
            <View style={styles.rowBetween}>
              <Text style={[styles.section, { color: colors.text }]}>Today (hourly)</Text>
            </View>
            <HourlyList hourly={data.hourly} />
            <Text style={[styles.section, { color: colors.text }]}>5-Day Forecast</Text>
            <ForecastList daily={data.daily} />
          </View>
        )}

        {!loading && errMsg && data && (
          <View style={styles.center}>
            <Text style={{ color: colors.danger }}>{errMsg}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
