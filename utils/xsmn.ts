import XMLParser from 'react-xml-parser'
import axios from 'axios'
import { stripHtmlTags } from '@/utils/stringFormat'
import { ILotteryDrawResult, ILotteryDrawTable } from '@/types'

export const fetchXSMN = async (url: string): Promise<ILotteryDrawResult> => {
    const response = await axios.get(url)
    const data = await response.data

    const xml = new XMLParser().parseFromString(data)

    const pageTitles: any[] = xml
        .getElementsByTagName('h1')
        .filter((i) => i.attributes?.class === 'pagetitle')

    const xmlTables: any[] = xml
        .getElementsByTagName('table')
        .filter((i) => i.attributes?.class === 'bkqtinhmiennam')

    const dataTables: ILotteryDrawTable[] = []

    xmlTables.forEach((table) => {
        const dataDivs = table.getElementsByTagName('div')
        const dataSpans = table.getElementsByTagName('span')
        const day = dataDivs.find((i) => i.attributes?.class === 'thu')
        const date = dataDivs.find((i) => i.attributes?.class === 'ngay')
        const code = dataSpans.find((i) => i.attributes?.class === 'loaive')

        const dataTds = table.getElementsByTagName('td')
        const priceS = dataTds.find((i) => i.attributes?.class === 'giaidb')
        const price1 = dataTds.find((i) => i.attributes?.class === 'giai1')
        const price2 = dataTds.find((i) => i.attributes?.class === 'giai2')
        const price3 = dataTds.find((i) => i.attributes?.class === 'giai3')
        const price4 = dataTds.find((i) => i.attributes?.class === 'giai4')
        const price5 = dataTds.find((i) => i.attributes?.class === 'giai5')
        const price6 = dataTds.find((i) => i.attributes?.class === 'giai6')
        const price7 = dataTds.find((i) => i.attributes?.class === 'giai7')
        const price8 = dataTds.find((i) => i.attributes?.class === 'giai8')

        const dataTable: ILotteryDrawTable = {
            day: day?.children[0]?.value,
            date: stripHtmlTags(date?.value)?.slice(-10),
            code: code?.value?.split(':')?.[1]?.trim(),
            priceS: priceS?.children?.map((i) => i.value),
            price1: price1?.children?.map((i) => i.value),
            price2: price2?.children?.map((i) => i.value),
            price3: price3?.children?.map((i) => i.value),
            price4: price4?.children?.map((i) => i.value),
            price5: price5?.children?.map((i) => i.value),
            price6: price6?.children?.map((i) => i.value),
            price7: price7?.children?.map((i) => i.value),
            price8: price8?.children?.map((i) => i.value)
        }
        dataTables.push(dataTable)
    })

    const _result = {
        pageTitle: pageTitles?.[0]?.value?.replace('KẾT QUẢ XỔ SỐ', 'KQSX'),
        dataTables
    }

    return _result
}
