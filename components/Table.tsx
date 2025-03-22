import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const sampleData = [
    { id: 1, name: 'John Doe', age: 28, city: 'New York' },
    { id: 2, name: 'Jane Smith', age: 34, city: 'Los Angeles' },
    { id: 3, name: 'Mike Johnson', age: 45, city: 'Chicago' },
    { id: 4, name: 'Emily Davis', age: 30, city: 'Houston' },
];

interface TableProps {
    data?: Record<string, number | string>[]
}

const Table: React.FC<TableProps> = ({ data = sampleData, ...props }) => {

    if(!data.length) {
        return <Text>No data</Text>
    }

    const columnNames = Object.keys(data[0])

    return (
        <View style={styles.container} {...props}>
            <View style={styles.headerRow}>
                {columnNames.map((colName) => (
                    <Text key={colName} style={[styles.headerCell, styles.cell]}>{colName}</Text>
                ))}
            </View>
            {data.map((row) => (
                <View key={row.id} style={styles.row}>
                    {columnNames.map((colName) => (
                        <Text key={row[colName]} style={styles.cell}>{row[colName]}</Text>
                    ))}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingVertical: 8,
        backgroundColor: '#f2f2f2',
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