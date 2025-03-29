import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { RootState } from '@/store';
import commonStyles, { parallaxIconSize } from '@/styles';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { GGroup, GType, HistoricalData } from '@/types';
import history from '../../assets/history.json';
import Table from '@/components/Table';
import { format, getTime, parse } from 'date-fns';
import { formatNumber } from '@/utils/numberFormat';

const GPrice = () => {
    const pageData = useSelector((state: RootState) => state.appData);
    const historicalData = history as HistoricalData;
    const tableData = historicalData.data
        .map((d) => ({
            ...d,
            date: parse(d.date, 'dd-MMM-yyyy', new Date())
        }))
        .sort((a, b) => getTime(b.date) - getTime(a.date))
        .map((d) => ({
            group: `${d.group} ${d.type.slice(0, 1)}`,
            buy: d.buy,
            quantity: d.quantity,
            value: formatNumber(d.buy * d.quantity),
            date: format(d.date, 'dd/MM/yy')
        }));

    const sjcBarBuyPrice =
        pageData?.prices?.find(
            (i) => i.group === GGroup.SJC && i.type === GType.Bar
        )?.buy || 0;

    const sjcRingBuyPrice =
        pageData?.prices?.find(
            (i) => i.group === GGroup.SJC && i.type === GType.Ring
        )?.buy || 0;

    const dojiBuyPrice =
        pageData?.prices?.find(
            (i) => i.group === GGroup.DOJI && i.type === GType.Ring
        )?.buy || 0;

    const pnjBuyPrice =
        pageData?.prices?.find(
            (i) => i.group === GGroup.PNJ && i.type === GType.Ring
        )?.buy || 0;

    const sumHistory = historicalData.data.reduce(
        (sum, current) => (sum += current.buy * current.quantity),
        0
    );

    const exclude = historicalData.exclude;

    console.log(
        555555,
        sjcBarBuyPrice,
        sjcRingBuyPrice,
        dojiBuyPrice,
        pnjBuyPrice
    );

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={
                <IconSymbol
                    size={parallaxIconSize}
                    color="#808080"
                    name="chevron.left.forwardslash.chevron.right"
                    style={commonStyles.headerImage}
                />
            }
        >
            <ThemedText>G Price</ThemedText>
            <View>
                <View style={styles.priceContainer}>
                    <ThemedText>Net Sum</ThemedText>
                    <ThemedText>
                        {formatNumber(sumHistory - exclude.value)}
                    </ThemedText>
                </View>
                <View style={styles.priceContainer}>
                    <ThemedText>Exclude</ThemedText>
                    <ThemedText>{exclude.quantity}</ThemedText>
                    <ThemedText>{exclude.value}</ThemedText>
                </View>
                <View style={styles.priceContainer}>
                    <ThemedText>Gross Sum</ThemedText>
                    <ThemedText>{formatNumber(sumHistory)}</ThemedText>
                </View>
            </View>
            {tableData?.length && <Table data={tableData} fontSize={13} />}
        </ParallaxScrollView>
    );
};

const styles = StyleSheet.create({
    tableContainer: {},
    priceContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

export default GPrice;
