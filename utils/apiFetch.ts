import axios from "axios";
import { formatGPrice } from "./numberFormat";
import { GGroup, GType, IPriceData } from "@/types";
import XMLParser from 'react-xml-parser';
import { FileLogger } from "react-native-file-logger";

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
            buyPrice: formatGPrice(bar.BuyValue),
            sellPrice: formatGPrice(bar.SellValue)
        },
        {
            group: GGroup.SJC,
            type: GType.Ring,
            buyPrice: formatGPrice(ring.BuyValue),
            sellPrice: formatGPrice(ring.SellValue)
        }
    ]
};

export const getGlobalPriceURI = () => {
    const url = 'https://www.tradingview-widget.com/embed-widget/single-quote/?locale=vi_VN#'
    const config = {
        symbol: "OANDA:XAUUSD",
        colorTheme: "light",
        isTransparent: true,
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
            buyPrice: formatGPrice(price.giamua * 10000),
            sellPrice: formatGPrice(price.giaban * 10000)
        },
    ]
}

export const getDOJIPrices = async (): Promise<IPriceData[]> => {
    const url = 'http://update.giavang.doji.vn/banggia/doji_92411/92411'

        const res = await axios.get(url)
        .then(response => {
            FileLogger.info('SUCCESS.request ====>' + JSON.stringify(response.data))
        })
        .catch((error) => {
            FileLogger.error('error.request ====>' + JSON.stringify(error.request))
        })


        // const data = await res.data;

        // const xml = new XMLParser().parseFromString(data);

        // console.log(666666, xml)


   

   
    return []
}

export const getGPrices = async (): Promise<IPriceData[]> => {
    const sjcPrices = await fetchSJCPrices();
    const pnjPrices = await getPNJPrices();
    const dojiPrices = await getDOJIPrices();

    return [...sjcPrices, ...pnjPrices]
}

export default getGPrices