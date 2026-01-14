import { Dimensions, StyleSheet } from 'react-native';

const ROW_ITEM_WIDTH = (Dimensions.get('screen').width - 24) / 3;

export default StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
  },
  day: { fontSize: 16, fontWeight: '600' },
  temp: { fontSize: 14, fontWeight: '600' },
  rowItemWrapper: {
    width: ROW_ITEM_WIDTH,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
