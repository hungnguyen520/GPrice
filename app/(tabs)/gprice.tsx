import ParallaxScrollView from '@/components/ParallaxScrollView'
import Table from '@/components/Table'
import { RootState } from '@/store'
import { GGroup } from '@/types'
import getHistory from '@/utils/getHistory'
import { formatNumber } from '@/utils/numberFormat'
import React from 'react'
import { useSelector } from 'react-redux'

const GPrice = () => {
    const pageData = useSelector((state: RootState) => state.appData)

    const dojiBuy = (pageData.domesticPrice?.DOJI?.buy || 0) / 1000000
    const sjcRBuy = (pageData.domesticPrice?.SJC_R?.buy || 0) / 1000000
    const sjcBuy = (pageData.domesticPrice?.SJC?.buy || 0) / 1000000
    const pnjBuy = (pageData.domesticPrice?.PNJ?.buy || 0) / 1000000
    const nmBuy = (pageData.domesticPrice?.NM?.buy || 0) / 1000000

    const {
        data: historyData,
        value: { avg: avgHistoryValue, sum: sumHistoryValue },
        quantity,
        excluded: { quantity: excludedQuantity }
    } = getHistory

    const currentDojiValue = quantity.doji * dojiBuy
    const currentSjcRValue = quantity.sjcR * sjcRBuy
    const currentSjcValue = quantity.sjc * sjcBuy
    const currentPnjValue = quantity.pnj * pnjBuy
    const currentNmValue = quantity.nm * nmBuy

    const sumCurrentValue =
        currentDojiValue +
        currentSjcRValue +
        currentSjcValue +
        currentPnjValue +
        currentNmValue

    const currentTable = [
        {
            group: `${GGroup.DOJI}`,
            buy: formatNumber(dojiBuy),
            quantity: quantity.doji,
            value: formatNumber(currentDojiValue)
        },
        {
            group: GGroup.SJC_R,
            buy: formatNumber(sjcRBuy),
            quantity: quantity.sjcR,
            value: formatNumber(currentSjcRValue)
        },
        {
            group: GGroup.SJC,
            buy: formatNumber(sjcBuy),
            quantity: quantity.sjc,
            value: formatNumber(currentSjcValue)
        },
        {
            group: `${GGroup.PNJ}`,
            buy: formatNumber(pnjBuy),
            quantity: quantity.pnj,
            value: formatNumber(currentPnjValue)
        },
        {
            group: `${GGroup.NM}`,
            buy: formatNumber(nmBuy),
            quantity: quantity.nm,
            value: formatNumber(currentNmValue)
        }
    ]

    const currentExcludedValue = excludedQuantity * sjcRBuy
    const historyExcludedValue = excludedQuantity * avgHistoryValue

    const grossProfitValue = sumCurrentValue - sumHistoryValue
    const netProfitValue =
        grossProfitValue - (currentExcludedValue - historyExcludedValue)

    const profitTable = [
        {
            title: 'Profit',
            value: formatNumber(grossProfitValue)
        },
        {
            title: 'Profit net',
            value: formatNumber(netProfitValue)
        }
    ]

    const currentSumTable = [
        {
            title: 'Current',
            quantity: quantity.total,
            value: formatNumber(sumCurrentValue)
        },
        {
            title: 'Excluded',
            quantity: excludedQuantity,
            value: formatNumber(currentExcludedValue)
        },
        {
            title: 'Net',
            quantity: Math.round((quantity.total - excludedQuantity) * 10) / 10,
            value: formatNumber(sumCurrentValue - currentExcludedValue)
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
                data={currentSumTable}
                noHeaderRow
                noLines
                columnCellStyle={[
                    { textAlign: 'left' },
                    { textAlign: 'right' },
                    { textAlign: 'right' }
                ]}
            />
            <Table
                data={currentTable}
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

export default GPrice
