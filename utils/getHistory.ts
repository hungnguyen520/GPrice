import { GGroup, HistoricalData, HistoricalViewModel } from '@/types'
import history from '../assets/history.json'
import { format, getTime, parse } from 'date-fns'
import { formatNumber } from './numberFormat'

const historicalData = history as HistoricalData
const historyTable = historicalData.data
    .map((d) => ({
        ...d,
        date: parse(d.date, 'dd-MMM-yyyy', new Date())
    }))
    .sort((a, b) => getTime(b.date) - getTime(a.date))
    .map((d) => ({
        group: d.group,
        buy: d.buy,
        quantity: d.quantity,
        value: formatNumber(d.buy * d.quantity),
        date: format(d.date, 'dd/MM/yy')
    }))

const _sumQuantity = historicalData.data.reduce(
    (sum, current) => (sum += current.quantity * 10),
    0
)
const sumQuantity = _sumQuantity / 10
const sumHistoryBuy = historicalData.data.reduce(
    (sum, current) => (sum += current.buy * current.quantity),
    0
)
const avgBuy = sumHistoryBuy / sumQuantity

// const sumSjsBarQuantity = historicalData.data.reduce(
//     (sum, current) =>
//         current.group === GGroup.SJC ? (sum += current.quantity) : sum,
//     0
// )

const sumSjsRQuantity = historicalData.data.reduce(
    (sum, current) =>
        current.group === GGroup.SJC_R ? (sum += current.quantity) : sum,
    0
)

const sumDojiQuantity = historicalData.data.reduce(
    (sum, current) =>
        current.group === GGroup.DOJI ? (sum += current.quantity) : sum,
    0
)

// const sumPnjQuantity = historicalData.data.reduce(
//     (sum, current) =>
//         current.group === GGroup.PNJ ? (sum += current.quantity) : sum,
//     0
// )

// const sumNmQuantity = historicalData.data.reduce(
//     (sum, current) =>
//         current.group === GGroup.NM ? (sum += current.quantity) : sum,
//     0
// )

export default {
    historyTable,
    historySum: {
        quantity: sumQuantity,
        value: sumHistoryBuy
    },
    avgBuy,
    quantity: {
        total: sumQuantity,
        sjcR: sumSjsRQuantity,
        doji: sumDojiQuantity
        // sjc: sumSjsBarQuantity,
        // pnj: sumPnjQuantity,
        // nm: sumNmQuantity,
    }
} as HistoricalViewModel
