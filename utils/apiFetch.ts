import {
    DomesticPrice,
    ExchangeRateVND,
    GlobalPrice,
    IPageData,
    PriceError
} from '@/types'
import axios, { GenericAbortSignal } from 'axios'
import XMLParser from 'react-xml-parser'
import { FileLogger } from 'react-native-file-logger'
import { ColorSchemeName } from 'react-native'
import { toNumber } from './numberFormat'

export const fetchSJCPrice = async (
    abortSignal: GenericAbortSignal
): Promise<DomesticPrice> => {
    const goldBarId = 1
    const goldRingId = 49
    const url = 'https://sjc.com.vn/GoldPrice/Services/PriceService.ashx'

    const res = await axios.get(url, { signal: abortSignal })
    const d = await res.data

    // const response = await axios.get('https://sjc.com.vn');
    // const data = await response.data;

    // const xml = new XMLParser().parseFromString(data);
    // const className = 'sjc-table-show-price'
    // const priceTable = xml.getElementsByTagName("table").find(i => i.attributes?.class === className)

    const bar = d.data.find((i) => i.Id === goldBarId)
    const ring = d.data.find((i) => i.Id === goldRingId)

    return {
        SJC: {
            buy: bar.BuyValue,
            sell: bar.SellValue
        },
        SJC_R: {
            buy: ring.BuyValue,
            sell: ring.SellValue
        }
    }
}

export const fetchPNJPrice = async (
    abortSignal: GenericAbortSignal
): Promise<DomesticPrice> => {
    const url =
        'https://edge-api.pnj.io/ecom-frontend/v1/get-gold-price?zone=00'
    const res = await axios.get(url, { signal: abortSignal })
    const d = await res.data

    const code = 'N24K'
    const price = d?.data?.find((i) => i.masp === code)

    const buy = price.giamua * 10000
    const sell = price.giaban * 10000

    return {
        PNJ: {
            buy,
            sell
        }
    }
}

export const fetchDOJIPriceXML = async (
    abortSignal: GenericAbortSignal
): Promise<DomesticPrice> => {
    const url = 'https://giavang.org/trong-nuoc/doji/'
    const res = await axios.get(url, { signal: abortSignal })
    const data = await res.data

    const sanitized = data.replace(/%(?![0-9A-Fa-f]{2})/g, '%25')

    const xml = new XMLParser().parseFromString(sanitized)

    const xmlPrices = xml
        .getElementsByTagName('span')
        .filter((i) => i.attributes?.class === 'gold-price')

    const lastTwo = xmlPrices?.slice(-2)

    const buy = lastTwo?.[0]?.value?.slice(0, 7) || '0'
    const sell = lastTwo?.[1]?.value?.slice(0, 7) || '0'

    return {
        DOJI: {
            buy: parseFloat(buy) * 1000000,
            sell: parseFloat(sell) * 1000000
        }
    }
}

export const fetchGlobalPriceXML = async (
    abortSignal: GenericAbortSignal
): Promise<number> => {
    const url = 'https://giavang.org/the-gioi/'
    const res = await axios.get(url, { signal: abortSignal })
    const data = await res.data

    const sanitized = data.replace(/%(?![0-9A-Fa-f]{2})/g, '%25')

    const xml = new XMLParser().parseFromString(sanitized)

    const xmlPrices = xml
        .getElementsByTagName('span')
        .find((i) => i.attributes?.class === 'crypto-price')

    const rawNumber = xmlPrices?.value || '0'
    const parsedNumber = parseFloat(rawNumber.replace(/,/g, ''))

    return parsedNumber
}

export const getExchangeRateVND = async (
    abortSignal: GenericAbortSignal
): Promise<ExchangeRateVND> => {
    const url =
        'https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx?b=10'
    const res = await axios.get(url, { signal: abortSignal })
    const d = await res.data

    const xml = new XMLParser().parseFromString(d)
    const usdPrice = xml
        .getElementsByTagName('Exrate')
        .find((i) => i.attributes?.CurrencyCode === 'USD')

    const usdRateStr = usdPrice?.attributes?.Transfer || 0
    const usdRate = parseFloat(usdRateStr.replace(',', ''))

    return {
        USD: usdRate
    }
}

export const getGlobalPriceWidgetURI = (
    theme: ColorSchemeName = 'dark'
): string => {
    const url =
        'https://www.tradingview-widget.com/embed-widget/single-quote/?locale=vi_VN#'
    const config = {
        symbol: 'OANDA:XAUUSD',
        colorTheme: theme,
        isTransparent: false
    }
    return encodeURI(url + JSON.stringify(config))
}

export const fetchGlobalPrices = async (
    abortSignal: GenericAbortSignal
): Promise<GlobalPrice> => {
    const taelPerOunceRate = 1.215276995

    const [globalPrice, exchangeRateVND] = await Promise.all([
        fetchGlobalPriceXML(abortSignal),
        getExchangeRateVND(abortSignal)
    ])

    const priceInOunceUSD =
        typeof globalPrice === 'number' ? globalPrice : toNumber(globalPrice)
    const priceInTaelUSD = priceInOunceUSD * taelPerOunceRate
    const usdRate = exchangeRateVND?.USD || 0
    const priceInTaelVND = priceInTaelUSD * usdRate

    const result = {
        ounce: priceInOunceUSD,
        tael: priceInTaelUSD,
        exchangeRateVND,
        taelVND: priceInTaelVND
    }

    return result
}
