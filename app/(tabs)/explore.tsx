import { Image, StyleSheet, Platform } from 'react-native'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import XMLParser from 'react-xml-parser'
import axios from 'axios'
import { FileLogger } from 'react-native-file-logger'
import { useEffect, useState } from 'react'
import { stripHtmlTags } from '@/utils/stringFormat'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import DropdownModal from '@/components/DropdownModal'
import { CHANNEL_SELECTION } from '@/constants/lottery.constant'

interface ILotteryDrawTable {
    day: string
    date: string
    code: string
    price8: number[]
    price7: number[]
    price6: number[]
    price5: number[]
    price4: number[]
    price3: number[]
    price2: number[]
    price1: number[]
    priceS: number[]
}

export default function Sample() {
    const pageData = useSelector((state: RootState) => state.appData)
    const [drawableURL, setDrawableURL] = useState<string>()

    const getXSMN = async () => {
        const url =
            'https://www.minhngoc.net.vn/ket-qua-xo-so/mien-nam/dong-nai.html'

        const response = await axios.get(url)
        const data = await response.data

        const xml = new XMLParser().parseFromString(data)
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

            const dataTable = {
                day: day?.children[0]?.value,
                date: stripHtmlTags(date?.value)?.slice(-10),
                code: code?.value,
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

            FileLogger.debug(JSON.stringify(dataTable))
        })
    }

    useEffect(() => {
        // getXSMN()
    }, [pageData])

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerHeight={50}
            backgroundImage={require('@/assets/images/hd-city-2nd-tab2.jpg')}
        >
            <ThemedView style={styles.titleContainer}>
                <DropdownModal
                    options={CHANNEL_SELECTION}
                    onChange={({ value }) => setDrawableURL(value as string)}
                />
            </ThemedView>
            <ThemedText>{drawableURL}</ThemedText>
        </ParallaxScrollView>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'transparent'
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
        backgroundColor: 'transparent'
    },
    reactLogo: {
        height: 119,
        width: 194,
        bottom: 0,
        left: 0,
        position: 'absolute'
    },
    collapseContainer: {
        backgroundColor: 'transparent'
    }
})
