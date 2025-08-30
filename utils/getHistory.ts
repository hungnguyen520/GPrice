import { GGroup, HistoricalData, HistoricalViewModel } from '@/types'
import { format, getTime, parse } from 'date-fns'
import history from '../assets/history.json'
import { formatNumber } from './numberFormat'

const historyData = history as HistoricalData
const formattedData = historyData.data
    .map((d) => ({
        ...d,
        date: parse(d.date, 'dd-MMM-yyyy', new Date())
    }))
    .sort((a, b) => getTime(b.date) - getTime(a.date))
    .map((d) => {
        return {
            group: d.group,
            value: d.value,
            quantity: d.quantity,
            total: formatNumber(d.value * d.quantity),
            date: format(d.date, 'dd/MM/yy')
        }
    })

const _sumQuantity = historyData.data.reduce(
    (sum, current) => (sum += current.quantity),
    0
)

const sumQuantity = Math.round(_sumQuantity * 10) / 10

const sumValue = historyData.data.reduce(
    (sum, current) => (sum += current.value * current.quantity),
    0
)
const avgValue = sumValue / sumQuantity

const sjcQuantity = historyData.data.reduce(
    (sum, current) =>
        current.group === GGroup.SJC ? (sum += current.quantity) : sum,
    0
)

const sjsRQuantity = historyData.data.reduce(
    (sum, current) =>
        current.group === GGroup.SJC_R ? (sum += current.quantity) : sum,
    0
)

const dojiQuantity = historyData.data.reduce(
    (sum, current) =>
        current.group === GGroup.DOJI ? (sum += current.quantity) : sum,
    0
)

const pnjQuantity = historyData.data.reduce(
    (sum, current) =>
        current.group === GGroup.PNJ ? (sum += current.quantity) : sum,
    0
)

const nmQuantity = historyData.data.reduce(
    (sum, current) =>
        current.group === GGroup.NM ? (sum += current.quantity) : sum,
    0
)

export default {
    data: formattedData,
    value: {
        avg: avgValue,
        sum: sumValue
    },
    quantity: {
        total: sumQuantity,
        sjcR: sjsRQuantity,
        doji: dojiQuantity,
        sjc: sjcQuantity,
        pnj: pnjQuantity,
        nm: nmQuantity
    },
    excluded: historyData.excluded
} as HistoricalViewModel
