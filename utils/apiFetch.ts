import axios from 'axios';
import {
    GGroup,
    GType,
    IExchangeRate,
    IGlobalPrice,
    IPriceData
} from '@/types';
import XMLParser from 'react-xml-parser';
import { FileLogger } from 'react-native-file-logger';
import { ColorSchemeName } from 'react-native';
import { formatNumber, formatPrice, toNumber } from './numberFormat';

export const fetchSJCPrices = async (): Promise<IPriceData[]> => {
    const goldBarId = 1;
    const goldRingId = 49;
    const url = 'https://sjc.com.vn/GoldPrice/Services/PriceService.ashx';

    const res = await axios.get(url);
    const d = await res.data;

    // const response = await axios.get('https://sjc.com.vn');
    // const data = await response.data;

    // const xml = new XMLParser().parseFromString(data);
    // const className = 'sjc-table-show-price'
    // const priceTable = xml.getElementsByTagName("table").find(i => i.attributes?.class === className)

    const bar = d.data.find((i) => i.Id === goldBarId);
    const ring = d.data.find((i) => i.Id === goldRingId);

    return [
        {
            group: GGroup.SJC,
            type: GType.Bar,
            buy: bar.BuyValue,
            sell: bar.SellValue,
            formatted: {
                buy: formatPrice(bar.BuyValue),
                sell: formatPrice(bar.SellValue),
            }
        },
        {
            group: GGroup.SJC,
            type: GType.Ring,
            buy: ring.BuyValue,
            sell: ring.SellValue,
            formatted: {
                buy: formatPrice(ring.BuyValue),
                sell: formatPrice(ring.SellValue),
            }
        }
    ];
};

export const getGlobalPriceURI = (theme: ColorSchemeName = 'dark') => {
    const url =
        'https://www.tradingview-widget.com/embed-widget/single-quote/?locale=vi_VN#';
    const config = {
        symbol: 'OANDA:XAUUSD',
        colorTheme: theme,
        isTransparent: false
    };
    return encodeURI(url + JSON.stringify(config));
};

export const getPNJPrices = async (): Promise<IPriceData[]> => {
    const url =
        'https://edge-api.pnj.io/ecom-frontend/v1/get-gold-price?zone=00';
    const res = await axios.get(url);
    const d = await res.data;

    const code = 'N24K';
    const price = d?.data?.find((i) => i.masp === code);

    const buy = price.giamua * 10000
    const sell =  price.giaban * 10000

    return [
        {
            group: GGroup.PNJ,
            type: GType.Ring,
            buy,
            sell,
            formatted: {
                buy: formatPrice(buy),
                sell: formatPrice(sell),
            }
        }
    ];
};

export const getDOJIPrices = async (): Promise<IPriceData[]> => {
    const url = 'http://update.giavang.doji.vn/banggia/doji_92411/92411';

    const res = await axios.get(url);
    const xml = await res.data;
    const xmlObj = new XMLParser().parseFromString(xml);

    const name = 'LED';
    const code = 'doji_3';
    const priceTable = xmlObj?.children?.find((i) => i.name === name);
    const price = priceTable?.children?.find((i) => i.attributes?.Key === code);

    const toIntNumber = (priceStr: string) =>
        priceStr ? parseInt(priceStr.replace(/,/g, '')) * 10000 : 0;

    const buy = toIntNumber(price?.attributes?.Buy)
    const sell = toIntNumber(price?.attributes?.Sell)

    return [
        {
            group: GGroup.DOJI,
            type: GType.Ring,
            buy,
            sell,
            formatted: {
                buy: formatPrice(buy),
                sell: formatPrice(sell)
            }
        }
    ];
};

export const getGlobalPrice = async (): Promise<IGlobalPrice | undefined> => {
    // https://www.kitco.com/charts/gold
    const currency = 'USD';
    const taelPerOunceRate = 1.215276995;
    const url = 'https://kdb-gw.prod.kitco.com/';
    const query =
        'fragment MetalFragment on Metal{ID symbol currency name results{...MetalQuoteFragment}}fragment MetalQuoteFragment on Quote{ID ask bid change changePercentage close high low mid open originalTime timestamp unit}query MetalQuote($symbol:String! $currency:String! $timestamp:Int){GetMetalQuoteV3(symbol:$symbol currency:$currency timestamp:$timestamp){...MetalFragment}}';
    const body = {
        query,
        variables: {
            symbol: 'AU',
            currency: 'USD',
            timestamp: Math.floor(Date.now() / 1000)
        },
        operationName: 'MetalQuote'
    };
    const [res, rates] = await Promise.all([
        axios.post(url, body),
        getExchangeRates()
    ]);
    const data = await res.data
    const globalPrice = data.data?.GetMetalQuoteV3?.results?.[0]?.bid;
    const priceInOunceUSD = typeof globalPrice === 'number' ? globalPrice : toNumber(globalPrice)
    const priceInTaelUSD = priceInOunceUSD * taelPerOunceRate;

    const usdRate = rates?.find((i) => i.code === currency);
    const usdRateValue = usdRate?.value || 0
    const priceInTaelVND = priceInTaelUSD * usdRateValue;

    return {
        ounceUSD: priceInOunceUSD,
        taelUSD: priceInTaelUSD,
        taelVND: priceInTaelVND,
        rates,
        formatted: {
            ounceUSD: formatNumber(priceInOunceUSD, 2),
            taelUSD: formatNumber(priceInTaelUSD, 2),
            usdRate: formatNumber(usdRateValue),
            taelVND: formatPrice(priceInTaelVND)
        }
    };
};

export const getExchangeRates = async (): Promise<IExchangeRate[]> => {
    const url = 'https://sjc.com.vn/GoldPrice/Services/PriceService.ashx';
    const res = await axios.post(url, 'method=GetExchangeRate');
    const d = await res.data;

    return d.data?.map((i) => ({
        code: i.CurrencyCode,
        value: typeof i.Transfer === 'number' ? i.Transfer : toNumber(i.Transfer)
    }));
};

export const getGPrices = async (): Promise<IPriceData[]> => {
    const [sjcPrices = [], pnjPrices = [], dojiPrices = []] = await Promise.all([
        fetchSJCPrices(),
        getPNJPrices(),
        getDOJIPrices()
    ]);
    return [...sjcPrices, ...pnjPrices, ...dojiPrices];
};

export default getGPrices;
