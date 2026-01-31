import {
    DomesticPrice,
    ExchangeRateVND,
    GlobalPrice,
    IPageData,
    PriceError
} from '@/types'
import axios from 'axios'
import XMLParser from 'react-xml-parser'
import { FileLogger } from 'react-native-file-logger'
import { ColorSchemeName } from 'react-native'
import { toNumber } from './numberFormat'

export const fetchSJCPrice = async () => {
    const goldBarId = 1
    const goldRingId = 49
    const url = 'https://sjc.com.vn/GoldPrice/Services/PriceService.ashx'

    const res = await axios.get(url)
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

export const fetchPNJPrice = async () => {
    const url =
        'https://edge-api.pnj.io/ecom-frontend/v1/get-gold-price?zone=00'
    const res = await axios.get(url)
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

export const fetchDOJIPrice = async () => {
    const url = 'https://bang-gia-vang.trangsucdoji-ldp.workers.dev'

    const res = await axios.get(url)
    const data = await res.data
    const xml = new XMLParser().parseFromString(data)

    const priceTable = xml?.children?.find((i) => i.name === 'LED')
    const price = priceTable?.children?.find(
        (i) => i.attributes?.Key === 'doji_2'
    )

    const toIntNumber = (priceStr: string) =>
        priceStr ? parseInt(priceStr.replace(/,/g, '')) * 10000 : 0

    const buy = toIntNumber(price?.attributes?.Buy)
    const sell = toIntNumber(price?.attributes?.Sell)

    return {
        DOJI: {
            buy,
            sell
        }
    }
}

export const fetchDOJIPriceXML = async () => {
    // const url = 'https://giavang.org/trong-nuoc/doji/'
    // const res = await axios.get(url)
    // const data = await res.data
    // try {
    //     const xml = new XMLParser().parseFromString(data)
    //     FileLogger.debug(xml)
    //     const xmlTables: any[] = xml
    //         .getElementsByTagName('div')
    //         .filter((i) => i.attributes?.class === 'gold-price-box')
    // } catch (e: any) {
    //     FileLogger.debug(e.toString())
    // }
}

export const getExchangeRateVND = async (): Promise<ExchangeRateVND> => {
    const url =
        'https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx?b=10'
    const res = await axios.get(url)
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

export const getGlobalPriceURI = (theme: ColorSchemeName = 'dark') => {
    const url =
        'https://www.tradingview-widget.com/embed-widget/single-quote/?locale=vi_VN#'
    const config = {
        symbol: 'OANDA:XAUUSD',
        colorTheme: theme,
        isTransparent: false
    }
    return encodeURI(url + JSON.stringify(config))
}

export const fetchGlobalPrice = async (): Promise<GlobalPrice> => {
    // https://www.kitco.com/charts/gold
    const taelPerOunceRate = 1.215276995
    const url = 'https://data-asg.goldprice.org/dbXRates/USD'

    const [globalRes, exchangeRateVND] = await Promise.all([
        axios.get(url),
        getExchangeRateVND()
    ])
    const data = await globalRes.data

    const globalPrice = data?.items?.find((i) => i.curr === 'USD')?.xauPrice
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

interface IData extends IPageData {
    error: PriceError
}

export const fetchAllPrices = async (): Promise<IData> => {
    const [sjcResult, dojiResult, pnjResult, globalResult] =
        await Promise.allSettled([
            fetchSJCPrice(),
            fetchDOJIPrice(),
            fetchPNJPrice(),
            fetchGlobalPrice()
        ])

    const domesticPrice: DomesticPrice = {}
    let globalPrice: GlobalPrice = {} as any
    const error: PriceError = {}

    if (sjcResult.status === 'fulfilled') {
        Object.assign(domesticPrice, sjcResult.value)
    } else {
        error.sjc = sjcResult.reason.toString()
    }

    if (dojiResult.status === 'fulfilled') {
        Object.assign(domesticPrice, dojiResult.value)
    } else {
        error.doji = dojiResult.reason.toString()
    }

    if (pnjResult.status === 'fulfilled') {
        Object.assign(domesticPrice, pnjResult.value)
    } else {
        error.pnj = pnjResult.reason.toString()
    }

    if (globalResult.status === 'fulfilled') {
        globalPrice = globalResult.value
    } else {
        error.global = globalResult.reason.toString()
    }

    if (domesticPrice.SJC_R) {
        const nmSell = domesticPrice.SJC_R.sell - 7000000
        const nmBuy = nmSell - 1500000
        Object.assign(domesticPrice, { NM: { buy: nmBuy, sell: nmSell } })
    }

    return {
        domesticPrice,
        globalPrice,
        error
    }
}

export default fetchAllPrices
