import axios from 'axios'
import { ExchangeRateVND, GlobalPrice, DomesticPrice } from '@/types'
import XMLParser from 'react-xml-parser'
// import { FileLogger } from 'react-native-file-logger'
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

export const getPNJPrice = async () => {
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

export const getDOJIPrice = async () => {
    const url = 'http://update.giavang.doji.vn/banggia/doji_92411/92411'

    const res = await axios.get(url)
    const xml = await res.data
    const xmlObj = new XMLParser().parseFromString(xml)

    const name = 'LED'
    const code = 'doji_3'
    const priceTable = xmlObj?.children?.find((i) => i.name === name)
    const price = priceTable?.children?.find((i) => i.attributes?.Key === code)

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

export const getGlobalPrice = async (): Promise<GlobalPrice | undefined> => {
    // https://www.kitco.com/charts/gold
    const taelPerOunceRate = 1.215276995
    const url = 'https://kdb-gw.prod.kitco.com/'
    const query =
        'fragment MetalFragment on Metal{ID symbol currency name results{...MetalQuoteFragment}}fragment MetalQuoteFragment on Quote{ID ask bid change changePercentage close high low mid open originalTime timestamp unit}query MetalQuote($symbol:String! $currency:String! $timestamp:Int){GetMetalQuoteV3(symbol:$symbol currency:$currency timestamp:$timestamp){...MetalFragment}}'
    const body = {
        query,
        variables: {
            symbol: 'AU',
            currency: 'USD',
            timestamp: Math.floor(Date.now() / 1000)
        },
        operationName: 'MetalQuote'
    }
    const [res, exchangeRateVND] = await Promise.all([
        axios.post(url, body),
        getExchangeRateVND()
    ])
    const data = await res.data
    const globalPrice = data.data?.GetMetalQuoteV3?.results?.[0]?.bid
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

export const getDomesticPrice = async (): Promise<DomesticPrice> => {
    const [
        sjcPrice,
        dojiPrice
        // pnjPrice
    ] = await Promise.all([
        fetchSJCPrice(),
        getDOJIPrice()
        // getPNJPrice()
    ])

    // const nmSell = dojiPrice.DOJI.sell - 7000000
    // const nmBuy = nmSell - 1500000

    return {
        ...sjcPrice,
        ...dojiPrice
        // ...pnjPrice,
        // NM: {
        //     buy: nmBuy,
        //     sell: nmSell
        // }
    }
}

export default getDomesticPrice
