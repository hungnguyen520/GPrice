import ParallaxScrollView from '@/components/ParallaxScrollView'
import Table from '@/components/Table'
import { RootState } from '@/store'
import { GGroup } from '@/types'
import getHistory from '@/utils/getHistory'
import { formatNumber, formatPrice } from '@/utils/numberFormat'
import React from 'react'
import { StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'

const GPrice = () => {
    const pageData = useSelector((state: RootState) => state.appData)

    const dojiBuy = pageData.domesticPrice?.DOJI?.buy || 0
    const sjcRBuy = pageData.domesticPrice?.SJC_R?.buy || 0
    const sjcBuy = pageData.domesticPrice?.SJC?.buy || 0
    const pnjBuy = pageData.domesticPrice?.PNJ?.buy || 0
    const nmBuy = pageData.domesticPrice?.NM?.buy || 0

    const {
        data: historyData,
        value: { avg: avgHistoryValue, sum: sumHistoryValue },
        quantity,
        excluded
    } = getHistory

    const presentDojiValue = quantity.doji * dojiBuy
    const presentSjcRValue = quantity.sjcR * sjcRBuy
    const presentSjcValue = quantity.sjc * sjcBuy
    const presentPnjValue = quantity.pnj * pnjBuy
    const presentNmValue = quantity.nm * nmBuy

    const sumPresentValue =
        (presentDojiValue +
            presentSjcRValue +
            presentSjcValue +
            presentPnjValue +
            presentNmValue) /
        1000000

    const presentTable = [
        {
            group: `${GGroup.DOJI}`,
            buy: formatPrice(dojiBuy),
            quantity: quantity.doji,
            value: formatPrice(presentDojiValue)
        },
        {
            group: GGroup.SJC_R,
            buy: formatPrice(sjcRBuy),
            quantity: quantity.sjcR,
            value: formatPrice(presentSjcRValue)
        },
        {
            group: GGroup.SJC,
            buy: formatPrice(sjcBuy),
            quantity: quantity.sjc,
            value: formatPrice(presentSjcValue)
        },
        {
            group: `${GGroup.PNJ}`,
            buy: formatPrice(pnjBuy),
            quantity: quantity.pnj,
            value: formatPrice(presentPnjValue)
        },
        {
            group: `${GGroup.NM}`,
            buy: formatPrice(nmBuy),
            quantity: quantity.nm,
            value: formatPrice(presentNmValue)
        }
    ]

    const excludedValue = (excluded.quantity * sjcRBuy) / 1000000

    const profitValue = sumPresentValue - excludedValue - sumHistoryValue

    const profitTable = [
        {
            title: 'Profit',
            value: formatNumber(profitValue)
        }
    ]

    const presentSumTable = [
        {
            title: 'Excluded',
            quantity: excluded.quantity,
            value: formatNumber(excludedValue)
        },
        {
            title: 'Current',
            quantity: quantity.total,
            value: formatNumber(sumPresentValue)
        },
        {
            title: 'Net',
            quantity:
                Math.round((quantity.total - excluded.quantity) * 10) / 10,
            value: formatNumber(sumPresentValue - excludedValue)
        }
    ]

    const historySumTable = [
        {
            title: 'History',
            quantity: quantity.total,
            value: formatNumber(sumHistoryValue)
        }
    ]
    const avgBuyTable = [
        {
            title: 'Avg History Buy',
            value: formatNumber(avgHistoryValue)
        }
    ]

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerHeight={50}
            backgroundImage={require('@/assets/images/hd-city-2nd-tab3.jpg')}
        >
            <Table
                data={profitTable}
                noHeaderRow
                columnCellStyle={[
                    { textAlign: 'left' },
                    { textAlign: 'right' }
                ]}
            />
            <Table
                data={presentSumTable}
                noHeaderRow
                noLines
                columnCellStyle={[
                    { textAlign: 'left' },
                    { textAlign: 'right' },
                    { textAlign: 'right' }
                ]}
            />
            <Table
                data={presentTable}
                columnCellStyle={[
                    { textAlign: 'left' },
                    { textAlign: 'right' },
                    { textAlign: 'right' },
                    { textAlign: 'right' }
                ]}
            />
            <Table
                data={avgBuyTable}
                noLines
                noHeaderRow
                fontSize={17}
                columnCellStyle={[
                    { textAlign: 'right' },
                    { textAlign: 'left', fontWeight: '700' }
                ]}
            />
            <Table
                data={historySumTable}
                noLines
                noHeaderRow
                fontSize={15}
                columnCellStyle={[
                    { textAlign: 'left' },
                    { textAlign: 'right' },
                    { textAlign: 'right' },
                    { textAlign: 'right' }
                ]}
            />
            <Table
                data={historyData}
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
    )
}

const styles = StyleSheet.create({
    flexContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 6
    }
})

export default GPrice
