import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { RootState } from '@/store';
import commonStyles, { parallaxIconSize } from '@/styles';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { GGroup, GType, HistoricalData } from '@/types';
import history from '../../assets/history.json';
import Table from '@/components/Table';
import { format, getTime, parse } from 'date-fns';
import { formatNumber, formatPrice } from '@/utils/numberFormat';

const historicalData = history as HistoricalData;
const historyTable = historicalData.data
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

const sumHistoryQuantity = historicalData.data.reduce(
    (sum, current) => (sum += current.quantity),
    0
);
const sumHistoryBuy = historicalData.data.reduce(
    (sum, current) => (sum += current.buy * current.quantity),
    0
);

const exclude = historicalData.exclude;

const historySumTable = [
    {
        title: 'Net History',
        quantity: sumHistoryQuantity - exclude.quantity,
        value: formatNumber(sumHistoryBuy - exclude.value)
    },
    {
        title: 'Exclude',
        quantity: exclude.quantity,
        value: exclude.value
    },
    {
        title: 'Gross History',
        quantity: sumHistoryQuantity,
        value: formatNumber(sumHistoryBuy)
    }
];

const sumSjsBarQuantity = historicalData.data.reduce(
    (sum, current) =>
        current.group === GGroup.SJC && current.type == GType.Bar
            ? (sum += current.quantity)
            : sum,
    0
);

const sumSjsRingQuantity = historicalData.data.reduce(
    (sum, current) =>
        current.group === GGroup.SJC && current.type == GType.Ring
            ? (sum += current.quantity)
            : sum,
    0
);

const sumDojiQuantity = historicalData.data.reduce(
    (sum, current) =>
        current.group === GGroup.DOJI && current.type == GType.Ring
            ? (sum += current.quantity)
            : sum,
    0
);

const sumPnjQuantity = historicalData.data.reduce(
    (sum, current) =>
        current.group === GGroup.PNJ && current.type == GType.Ring
            ? (sum += current.quantity)
            : sum,
    0
);

const GPrice = () => {
    const pageData = useSelector((state: RootState) => state.appData);

    const sjcBarBuy =
        pageData?.prices?.find(
            (i) => i.group === GGroup.SJC && i.type === GType.Bar
        )?.buy || 0;

    const sjcRingBuy =
        pageData?.prices?.find(
            (i) => i.group === GGroup.SJC && i.type === GType.Ring
        )?.buy || 0;

    const dojiBuy =
        pageData?.prices?.find((i) => i.group === GGroup.DOJI)?.buy || 0;

    const pnjBuy =
        pageData?.prices?.find((i) => i.group === GGroup.PNJ)?.buy || 0;

    const presentTable = [
        {
            group: `${GGroup.SJC} ${GType.Bar}`,
            buy: formatPrice(sjcBarBuy),
            quantity: sumSjsBarQuantity,
            value: formatPrice(sjcBarBuy * sumSjsBarQuantity)
        },
        {
            group: `${GGroup.SJC} ${GType.Ring}`,
            buy: formatPrice(sjcRingBuy),
            quantity: sumSjsRingQuantity,
            value: formatPrice(sjcRingBuy * sumSjsRingQuantity)
        },
        {
            group: `${GGroup.PNJ}`,
            buy: formatPrice(pnjBuy),
            quantity: sumPnjQuantity,
            value: formatPrice(pnjBuy * sumPnjQuantity)
        },
        {
            group: `${GGroup.DOJI}`,
            buy: formatPrice(dojiBuy),
            quantity: sumDojiQuantity,
            value: formatPrice(dojiBuy * sumDojiQuantity)
        }
    ];

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
            <Table data={presentTable} columnCellStyle={[
                    { textAlign: 'left' },
                    { textAlign: 'right' },
                    { textAlign: 'right' },
                    { textAlign: 'right' }
                ]} />
            <Table
                data={historySumTable}
                noHeaderRow
                noLines
                columnCellStyle={[
                    { textAlign: 'left' },
                    { textAlign: 'right' },
                    { textAlign: 'right' }
                ]}
            />
            <Table
                data={historyTable}
                fontSize={13}
                columnCellStyle={[
                    { textAlign: 'left' },
                    { textAlign: 'right' },
                    { textAlign: 'right' },
                    { textAlign: 'right' },
                    { textAlign: 'right' }
                ]}
            />
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
