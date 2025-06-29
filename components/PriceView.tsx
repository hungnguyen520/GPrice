import React from 'react'
import { View } from 'react-native'
import { ThemedText } from './ThemedText'
import { StyleSheet } from 'react-native'
import { ILotteryDrawTable } from '@/types'

export const PriceView = (props: ILotteryDrawTable) => {
    const tables = [
        { label: 'P8', values: props.price8 },
        { label: 'P7', values: props.price7 },
        { label: 'P6', values: props.price6 },
        { label: 'P5', values: props.price5 },
        { label: 'P4', values: props.price4 },
        { label: 'P3', values: props.price3 },
        { label: 'P2', values: props.price2 },
        { label: 'P1', values: props.price1 },
        { label: 'PS', values: props.priceS }
    ]
    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <ThemedText>{props.day}</ThemedText>
                <ThemedText>{props.date}</ThemedText>
                <ThemedText>{props.code}</ThemedText>
            </View>
            {tables.map((table, idx) => (
                <View style={styles.line} key={idx}>
                    <View style={styles.lineLabel}>
                        <ThemedText>{table.label}</ThemedText>
                    </View>
                    <View style={styles.lineValues}>
                        {table.values.map((p) => (
                            <ThemedText style={styles.LineNumber} key={p}>
                                {p}
                            </ThemedText>
                        ))}
                    </View>
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderColor: '#ccc',
        borderWidth: StyleSheet.hairlineWidth,
        marginBottom: 16
    },
    title: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        padding: 16,
        borderColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    line: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch',
        borderColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    lineLabel: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
    },
    lineValues: {
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 12,
        padding: 16
    },
    LineNumber: {
        fontSize: 18,
        fontWeight: '600'
    }
})
