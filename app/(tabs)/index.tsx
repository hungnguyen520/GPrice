import CustomButton from '@/components/CustomButton'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { SafeWebView } from '@/components/SafeWebView'
import Table from '@/components/Table'
import { ThemedText } from '@/components/ThemedText'
import { useColorScheme } from '@/hooks/useColorScheme'
import { RootState } from '@/store'
import { setAppData } from '@/store/appDataSlice'
import commonStyles from '@/styles'
import { IPageData } from '@/types'
import {
    getDomesticPrice,
    getGlobalPrice,
    getGlobalPriceURI
} from '@/utils/apiFetch'
import { formatNumber, formatPrice } from '@/utils/numberFormat'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const getPageData = async () => {
    const data: IPageData = {}
    const errors: string[] = []
    const [vnRes, gloRes] = await Promise.allSettled([
        getDomesticPrice(),
        getGlobalPrice()
    ])

    if (vnRes.status === 'fulfilled') {
        data.domesticPrice = vnRes.value
    } else {
        errors.push(vnRes.reason.toString())
    }

    if (gloRes.status === 'fulfilled') {
        data.globalPrice = gloRes.value
    } else {
        errors.push(gloRes.reason.toString())
    }

    return {
        data,
        errors
    }
}

const TextLarge = ({ fontSize = 18, ...rest }) => (
    <ThemedText style={{ fontSize, marginBottom: 6 }} {...rest} />
)

const Home = () => {
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState<string[]>([])
    const theme = useColorScheme() ?? 'dark'
    const pageData = useSelector((state: RootState) => state.appData)
    const dispatch = useDispatch()

    const refreshPage = useCallback(async (callback?: Function) => {
        setLoading(true)
        const { data, errors } = await getPageData()
        if (data) {
            dispatch(setAppData(data))
        }
        if (errors?.length) {
            setErrors(errors)
        }
        setLoading(false)
        callback?.()
    }, [])

    const encodedUrl = getGlobalPriceURI(theme)

    const domesticTableData = [] as any[]
    if (pageData?.domesticPrice) {
        Object.keys(pageData.domesticPrice).forEach((key) => {
            const price = pageData.domesticPrice?.[key]
            domesticTableData.push({
                group: key,
                buy: formatPrice(price?.buy || 0),
                sell: formatPrice(price?.sell || 0)
            })
        })
    }

    const globalPriceFormatted = {
        ounce: formatNumber(pageData?.globalPrice?.ounce || 0, 2),
        tael: formatNumber(pageData?.globalPrice?.tael || 0, 2),
        usdRate: formatNumber(pageData?.globalPrice?.exchangeRateVND?.USD || 0),
        taelVND: formatPrice(pageData?.globalPrice?.taelVND || 0)
    }

    useEffect(() => {
        refreshPage()
    }, [])

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            onRefresh={refreshPage}
            headerHeight={50}
        >
            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <>
                    {errors?.map((err, idx) => (
                        <Text key={idx} style={commonStyles.error}>
                            {err}
                        </Text>
                    ))}
                    <SafeWebView uri={encodedUrl} style={styles.webview} />
                    <View>
                        <View style={styles.globalPriceItem}>
                            <TextLarge>Ounce</TextLarge>
                            <TextLarge>{globalPriceFormatted.ounce}</TextLarge>
                        </View>
                        <View style={styles.globalPriceItem}>
                            <TextLarge>Tael</TextLarge>
                            <TextLarge>{globalPriceFormatted.tael}</TextLarge>
                        </View>
                        <View style={styles.globalPriceItem}>
                            <TextLarge style={{ fontSize: 20 }}>
                                Rate USD
                            </TextLarge>
                            <TextLarge>
                                {globalPriceFormatted.usdRate}
                            </TextLarge>
                        </View>
                        <View style={styles.globalPriceItem}>
                            <TextLarge>Tael VND</TextLarge>
                            <TextLarge>
                                {globalPriceFormatted.taelVND}
                            </TextLarge>
                        </View>
                    </View>
                    {domesticTableData?.length && (
                        <View style={styles.tableContainer}>
                            <Table
                                data={domesticTableData}
                                columnCellStyle={[
                                    { textAlign: 'left' },
                                    { textAlign: 'right' },
                                    { textAlign: 'right' }
                                ]}
                                fontSize={18}
                            />
                        </View>
                    )}
                    <CustomButton
                        iconName="arrow.2.circlepath"
                        borderColor={'green'}
                        iconColor={'green'}
                        backgroundColor={'transparent'}
                        onPress={() => refreshPage()}
                    />
                </>
            )}
        </ParallaxScrollView>
    )
}

const styles = StyleSheet.create({
    tableContainer: {
        paddingBottom: 8
    },
    webview: {
        flex: 1,
        height: 100,
        backgroundColor: 'transparent',
        marginBottom: 10
    },
    globalPriceItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})

export default Home
