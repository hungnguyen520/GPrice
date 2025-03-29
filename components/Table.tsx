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
    data?: Record<string,any>[]
    fontSize?: number
}

const Table: React.FC<TableProps> = ({ data = sampleData, fontSize = 16 }) => {

    if(!data.length) {
        return <ThemedText>No data</ThemedText>
    }
    const sampleRow = data[0]
    const columns = Object.keys(data[0])
    const validColumns = columns.filter(col => typeof sampleRow[col] !== 'object')

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                {validColumns.map((colName) => (
                    <ThemedText key={colName} style={[styles.headerCell, styles.cell, { fontSize }]}>{colName}</ThemedText>
                ))}
            </View>
            {data.map((row, idx) => (
                <View key={idx} style={styles.row}>
                    {validColumns.map((colName, idx) => (
                        <ThemedText key={idx} style={[styles.cell, { fontSize }]}>{row[colName]?.toString()}</ThemedText>
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
        paddingHorizontal: 6,
    },
});

export default Table;