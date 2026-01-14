import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  city: {
    fontSize: 22,
    fontWeight: '700',
  },
  desc: { fontSize: 14 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  temp: {
    fontSize: 36,
    fontWeight: '800',
  },
  image: {
    width: 70,
    height: 70,
  },
});
