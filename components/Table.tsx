import React from 'react';
import { View, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { ThemedText } from './ThemedText';
import Divider from './Devider';

const sampleData = [
    { id: 1, name: 'John Doe', age: 28, city: 'New York' },
    { id: 2, name: 'Jane Smith', age: 34, city: 'Los Angeles' },
    { id: 3, name: 'Mike Johnson', age: 45, city: 'Chicago' },
    { id: 4, name: 'Emily Davis', age: 30, city: 'Houston' }
];

interface TableProps {
    data?: Record<string, any>[];
    fontSize?: number;
    noHeaderRow?: boolean;
    noLines?: boolean
    columnCellStyle?: StyleProp<TextStyle>[];
}

const Table: React.FC<TableProps> = ({
    data = sampleData,
    fontSize = 16,
    noHeaderRow = false,
    noLines = false,
    columnCellStyle = []
}) => {
    if (!data.length) {
        return <ThemedText>No data</ThemedText>;
    }
    const sampleRow = data[0];
    const columns = Object.keys(data[0]);
    const validColumns = columns.filter(
        (col) => typeof sampleRow[col] !== 'object'
    );
    const noLineStyle = noLines ? styles.noLine : {}

    return (
        <View style={styles.container}>
            {!noHeaderRow ? (
                <View style={[styles.headerRow, noLineStyle]}>
                    {validColumns.map((colName, idx) => {
                        const cellStyle = columnCellStyle[idx] || {};
                        return (
                            <ThemedText
                                key={idx}
                                style={[
                                    styles.headerCell,
                                    styles.cell,
                                    { fontSize },
                                    cellStyle
                                ]}
                            >
                                {colName}
                            </ThemedText>
                        );
                    })}
                </View>
            ) : (
                !noLines && <Divider />
            )}
            {data.map((row, idx) => (
                <View key={idx} style={[styles.row, noLineStyle]}>
                    {validColumns.map((colName, idx) => {
                        const cellStyle = columnCellStyle[idx] || {};
                        return (
                            <ThemedText
                                key={idx}
                                style={[styles.cell, { fontSize }, cellStyle]}
                            >
                                {row[colName]?.toString()}
                            </ThemedText>
                        );
                    })}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerRow: {
        flexDirection: 'row',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
        paddingVertical: 8
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ddd',
        paddingVertical: 8
    },
    headerCell: {
        fontWeight: 'bold'
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        minWidth: 50, // Minimum width for each cell
        paddingHorizontal: 6
    },
    noLine: {
        borderBottomWidth: 0,
        paddingVertical: 0
    }
});

export default Table;
