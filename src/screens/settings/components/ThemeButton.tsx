import React from 'react';
import { Pressable, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { useTheme } from '@/constants/theme';
import { setThemeMode } from '@/src/features/weather/weather.slice';
import { makeStyles, type ThemeColors } from '@/src/screens/settings/styles';

import type { FC } from 'react';

type ThemeButtonProps = { label: string; value: 'system' | 'light' | 'dark' };

const ThemeButton: FC<ThemeButtonProps> = ({ label, value }) => {
  const { colors, mode } = useTheme();
  const themedStyles = makeStyles(colors as ThemeColors);
  const active = mode === value;
  const dispatch = useDispatch();

  const handlePress = () => dispatch(setThemeMode(value));

  return (
    <Pressable style={[themedStyles.btn, active && themedStyles.btnActive]} onPress={handlePress}>
      <Text style={[themedStyles.btnText, active && themedStyles.btnTextActive]}>{label}</Text>
    </Pressable>
  );
};

export default ThemeButton;
