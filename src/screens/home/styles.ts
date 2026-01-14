import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 16 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  section: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
