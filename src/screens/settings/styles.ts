import { StyleSheet } from 'react-native';

export type ThemeColors = {
  bg: string;
  text: string;
  sub: string;
  card: string;
  border: string;
  tint: string;
  danger: string;
};

export const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    container: { padding: 16, gap: 12 },
    title: { fontSize: 28, fontWeight: '800', color: colors.text },
    section: { fontSize: 18, fontWeight: '700', marginTop: 8, color: colors.text },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
    },
    btn: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      backgroundColor: colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      opacity: 0.9,
    },
    btnActive: {
      backgroundColor: colors.tint,
      borderColor: colors.tint,
      opacity: 1,
    },
    btnText: { color: colors.text, fontWeight: '700' },
    btnTextActive: { color: '#fff' },
    favoriteRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },

    dangerText: { color: colors.danger },
    subText: { color: colors.sub },
  });
