import ParallaxScrollView from '@/components/ParallaxScrollView'
import { RootState } from '@/store'
import React from 'react'
import { StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { GGroup } from '@/types'
import Table from '@/components/Table'
import { formatNumber, formatPrice } from '@/utils/numberFormat'
import historyData from '@/utils/historyData'

const GPrice = () => {
    const pageData = useSelector((state: RootState) => state.appData)

    const prices = pageData?.prices?.reduce((d: any, current) => {
        if (current.group === GGroup.SJC) {
            d.sjcBuy = current.buy
        }
        if (current.group === GGroup.SJC_R) {
            d.sjcRBuy = current.buy
        }
        if (current.group === GGroup.DOJI) {
            d.dojiBuy = current.buy
        }
        if (current.group === GGroup.PNJ) {
            d.pnjBuy = current.buy
        }
        return d
    }, {})

    const { sjcBuy, sjcRBuy, dojiBuy, pnjBuy } = prices

    const { historyTable, sumHistoryTable, summary } = historyData

    const presentSjcValue = summary.quantity.sjc * sjcBuy
    const resentSjcRValue = summary.quantity.sjcR * sjcRBuy
    const presentPnjValue = summary.quantity.pnj * pnjBuy
    const presentDojiValue = summary.quantity.doji * dojiBuy
    const sumPresentBuy =
        presentSjcValue + resentSjcRValue + presentPnjValue + presentDojiValue

    const presentTable = [
        {
            group: GGroup.SJC,
            buy: formatPrice(sjcBuy),
            quantity: summary.quantity.sjc,
            value: formatPrice(presentSjcValue)
        },
        {
            group: GGroup.SJC_R,
            buy: formatPrice(sjcRBuy),
            quantity: summary.quantity.sjcR,
            value: formatPrice(resentSjcRValue)
        },
        {
            group: `${GGroup.PNJ}`,
            buy: formatPrice(pnjBuy),
            quantity: summary.quantity.pnj,
            value: formatPrice(presentPnjValue)
        },
        {
            group: `${GGroup.DOJI}`,
            buy: formatPrice(dojiBuy),
            quantity: summary.quantity.doji,
            value: formatPrice(presentDojiValue)
        }
    ]

    const presentExcludedValue = summary.quantity.excluded * sjcBuy

    const sumPresentTable = [
        {
            title: 'Net',
            quantity: summary.quantity.total - summary.quantity.excluded,
            value: formatPrice(sumPresentBuy - presentExcludedValue)
        },
        {
            title: 'Exclude',
            quantity: summary.quantity.excluded,
            value: formatPrice(presentExcludedValue)
        },
        {
            title: 'Gross',
            quantity: summary.quantity.total,
            value: formatPrice(sumPresentBuy)
        }
    ]

    const excludedProfitValue =
        presentExcludedValue / 1000000 - summary.buy.excluded
    const grossProfitValue = sumPresentBuy / 1000000 - summary.buy.history

    const profitTable = [
        {
            title: 'Net',
            value: formatNumber(grossProfitValue - excludedProfitValue)
        },
        {
            title: 'Exclude',
            value: formatNumber(excludedProfitValue)
        },
        {
            title: 'Gross',
            value: formatNumber(grossProfitValue)
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
                data={sumPresentTable}
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
                data={sumHistoryTable}
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
