import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';

const sampleData = [
    { id: 1, name: 'John Doe', age: 28, city: 'New York' },
    { id: 2, name: 'Jane Smith', age: 34, city: 'Los Angeles' },
    { id: 3, name: 'Mike Johnson', age: 45, city: 'Chicago' },
    { id: 4, name: 'Emily Davis', age: 30, city: 'Houston' },
];

interface TableProps {
    data?: Record<string, number | string | undefined>[]
}

const Table: React.FC<TableProps> = ({ data = sampleData }) => {

    if(!data.length) {
        return <ThemedText>No data</ThemedText>
    }

    const columnNames = Object.keys(data[0])

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                {columnNames.map((colName) => (
                    <ThemedText key={colName} style={[styles.headerCell, styles.cell]}>{colName}</ThemedText>
                ))}
            </View>
            {data.map((row, idx) => (
                <View key={idx} style={styles.row}>
                    {columnNames.map((colName) => (
                        <ThemedText key={row[colName]} style={styles.cell}>{row[colName]}</ThemedText>
                    ))}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 16
    },
    headerRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 8,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 8,
    },
    headerCell: {
        fontWeight: 'bold',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        minWidth: 50, // Minimum width for each cell
        paddingHorizontal: 8,
    },
});

export default Table;