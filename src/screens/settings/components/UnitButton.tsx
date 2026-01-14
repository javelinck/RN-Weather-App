import React from 'react';
import { Pressable, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { useTheme } from '@/constants/theme';
import { setUnits } from '@/src/features/weather/weather.slice';
import { makeStyles, type ThemeColors } from '@/src/screens/settings/styles';

import type { RootState } from '@/src/store/store';
import type { FC } from 'react';

type UnitButtonProps = { label: string; value: 'metric' | 'imperial' };

const UnitButton: FC<UnitButtonProps> = ({ label, value }) => {
  const dispatch = useDispatch();
  const { units } = useSelector((s: RootState) => s.weather);
  const { colors } = useTheme();

  const themedStyles = makeStyles(colors as ThemeColors);

  const active = units === value;
  return (
    <Pressable
      style={[themedStyles.btn, active && themedStyles.btnActive]}
      onPress={() => dispatch(setUnits(value))}
    >
      <Text style={[themedStyles.btnText, active && themedStyles.btnTextActive]}>{label}</Text>
    </Pressable>
  );
};

export default UnitButton;
