import axios from "axios";
import { GGroup, GType, IPriceData } from "@/types";
import XMLParser from 'react-xml-parser';
import { FileLogger } from "react-native-file-logger";
import { ColorSchemeName } from "react-native";
import { formatPrice } from "./numberFormat";

export const fetchSJCPrices = async (): Promise<IPriceData[]> => {
    const goldBarId = 1
    const goldRingId = 49
    const url = 'https://sjc.com.vn/GoldPrice/Services/PriceService.ashx'

    // const response = await axios.get('https://sjc.com.vn');
    // const data = await response.data;

    // const xml = new XMLParser().parseFromString(data);
    // const className = 'sjc-table-show-price'
    // const priceTable = xml.getElementsByTagName("table").find(i => i.attributes?.class === className)

    const res = await axios.get(url);
    const d = await res.data;

    const bar = d.data.find(i => i.Id === goldBarId)
    const ring = d.data.find(i => i.Id === goldRingId)

    return [
        {
            group: GGroup.SJC,
            type: GType.Bar,
            buy: formatPrice(bar.BuyValue),
            sell: formatPrice(bar.SellValue)
        },
        {
            group: GGroup.SJC,
            type: GType.Ring,
            buy: formatPrice(ring.BuyValue),
            sell: formatPrice(ring.SellValue)
        }
    ]
};

export const getGlobalPriceURI = (theme: ColorSchemeName = "dark") => {
    const url = 'https://www.tradingview-widget.com/embed-widget/single-quote/?locale=vi_VN#'
    const config = {
        symbol: "OANDA:XAUUSD",
        colorTheme: theme,
        isTransparent: false,
    }
    return encodeURI(url + JSON.stringify(config));
}

export const getPNJPrices = async (): Promise<IPriceData[]> => {
    const url = 'https://edge-api.pnj.io/ecom-frontend/v1/get-gold-price?zone=00'
    const res = await axios.get(url);
    const d = await res.data;

    const code = 'N24K';
    const price = d?.data?.find((i) => i.masp === code)

    return [
        {
            group: GGroup.PNJ,
            type: GType.Ring,
            buy: formatPrice(price.giamua),
            sell: formatPrice(price.giaban)
        },
    ]
}

export const getDOJIPrices = async (): Promise<IPriceData[]> => {
    const url = 'http://update.giavang.doji.vn/banggia/doji_92411/92411'

    const res = await axios.get(url)
    const xml = await res.data;
    const xmlObj = new XMLParser().parseFromString(xml);

    const name = 'LED'
    const code = 'doji_3'
    const priceTable = xmlObj?.children?.find(i => i.name === name)
    const price = priceTable?.children?.find(i => i.attributes?.Key === code)

    const toNumber = (priceStr: string) => priceStr ? parseInt(priceStr.replace(/,/g, '')) * 10000 : 0

    return [
        {
            group: GGroup.DOJI,
            type: GType.Ring,
            buy: formatPrice(toNumber(price?.attributes?.Buy)),
            sell: formatPrice(toNumber(price?.attributes?.Sell))
        },
    ]
}

export const getGlobalPrice = async () => {
    try {
        const url = 'https://giavang.org/the-gioi/'
    const response = await axios.get(url);
    const data = await response.data;
    const xml = new XMLParser().parseFromString(data);
    // const className = 'crypto-price'
    // const priceSpan = xml.getElementsByTagName("span").find(i => i.attributes?.class === className)
    FileLogger.info(JSON.stringify(xml))
    } catch (error) {
        FileLogger.error(JSON.stringify(error))
    }
    
}

export const getGPrices = async (): Promise<IPriceData[]> => {
    const sjcPrices = await fetchSJCPrices();
    const pnjPrices = await getPNJPrices();
    const dojiPrices = await getDOJIPrices();

    return [...sjcPrices, ...dojiPrices, ...pnjPrices]
}

export default getGPrices