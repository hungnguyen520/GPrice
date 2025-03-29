import { View, StyleSheet } from 'react-native';

const Divider = () => (
  <View style={styles.divider} />
);

const styles = StyleSheet.create({
  divider: {
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
    margin: 0,
  }
});

export default Divider