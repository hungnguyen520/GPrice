import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center'
    },
    error: {
        color: 'red',
        textAlign: 'center'
    }
});

export default commonStyles