import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, TextInput, Pressable, ActivityIndicator } from 'react-native';

import { useTheme } from '@/constants/theme';
import { useSearchBarLogic } from '@/src/components/search-bar/useSearchBarLogic';

import styles from './styles';

import type { FC } from 'react';

type SearchBarProps = {
  onSubmit: (query: string) => void;
  loading?: boolean;
  placeholder?: string;
};

const SearchBar: FC<SearchBarProps> = ({ onSubmit, loading, placeholder = 'Search city…' }) => {
  const { colors } = useTheme();
  const { value, setValue, handleSubmitEditing } = useSearchBarLogic(onSubmit);

  return (
    <View style={[styles.row, { backgroundColor: colors.bg }]}>
      <Ionicons name="search" size={20} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        returnKeyType="search"
        onSubmitEditing={handleSubmitEditing}
      />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Pressable onPress={handleSubmitEditing}>
          <Ionicons name="arrow-forward-circle" size={24} />
        </Pressable>
      )}
    </View>
  );
};

export default SearchBar;
