import ParallaxScrollView from '@/components/ParallaxScrollView'
import { RootState } from '@/store'
import React from 'react'
import { StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { GGroup } from '@/types'
import Table from '@/components/Table'
import { formatNumber, formatPrice } from '@/utils/numberFormat'
import getHistory from '@/utils/getHistory'

const GPrice = () => {
    const pageData = useSelector((state: RootState) => state.appData)

    const dojiBuy = pageData.domesticPrice?.DOJI?.buy || 0
    // const sjcRBuy = pageData.domesticPrice?.SJC_R?.buy || 0
    // const sjcBuy = pageData.domesticPrice?.SJC?.buy || 0
    // const pnjBuy = pageData.domesticPrice?.PNJ?.buy || 0
    // const nmBuy = pageData.domesticPrice?.NM?.buy || 0

    const { historyTable, historySum, avgBuy, quantity } = getHistory

    const presentDojiValue = quantity.doji * dojiBuy
    // const presentSjcRValue = quantity.sjcR * sjcRBuy
    // const presentSjcValue = summary.quantity.sjc * sjcBuy
    // const presentPnjValue = summary.quantity.pnj * pnjBuy
    // const presentNmValue = summary.quantity.nm * nmBuy

    const sumPresentBuy = presentDojiValue
    // presentSjcRValue +
    // presentSjcValue +
    // presentPnjValue +
    // presentNmValue

    const presentTable = [
        {
            group: `${GGroup.DOJI}`,
            buy: formatPrice(dojiBuy),
            quantity: quantity.doji,
            value: formatPrice(presentDojiValue)
        }
        // {
        //     group: GGroup.SJC_R,
        //     buy: formatPrice(sjcRBuy),
        //     quantity: quantity.sjcR,
        //     value: formatPrice(presentSjcRValue)
        // },
        // {
        //     group: GGroup.SJC,
        //     buy: formatPrice(sjcBuy),
        //     quantity: summary.quantity.sjc,
        //     value: formatPrice(presentSjcValue)
        // },
        // {
        //     group: `${GGroup.PNJ}`,
        //     buy: formatPrice(pnjBuy),
        //     quantity: summary.quantity.pnj,
        //     value: formatPrice(presentPnjValue)
        // },
        // {
        //     group: `${GGroup.NM}`,
        //     buy: formatPrice(nmBuy),
        //     quantity: summary.quantity.nm,
        //     value: formatPrice(presentNmValue)
        // }
    ]

    const profitValue = sumPresentBuy / 1000000 - historySum.value

    const profitTable = [
        {
            title: 'Profit',
            value: formatNumber(profitValue)
        }
    ]

    const presentSumTable = [
        {
            title: 'Current',
            quantity: quantity.total,
            value: formatPrice(sumPresentBuy)
        }
    ]

    const historySumTable = [
        {
            title: 'History',
            ...historySum
        }
    ]
    const avgBuyTable = [
        {
            title: 'Avg Buy',
            value: formatNumber(avgBuy)
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
