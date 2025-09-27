import CustomButton from '@/components/CustomButton'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { SafeWebView } from '@/components/SafeWebView'
import Table from '@/components/Table'
import { ThemedText } from '@/components/ThemedText'
import { useColorScheme } from 'react-native'
import { RootState } from '@/store'
import { setAppData } from '@/store/appDataSlice'
import commonStyles from '@/styles'
import { IPageData } from '@/types'
import fetchAllPrices, { getGlobalPriceURI } from '@/utils/apiFetch'
import { formatNumber, formatPrice } from '@/utils/numberFormat'
import { isEmpty } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const TextLarge = ({ fontSize = 18, ...rest }) => (
    <ThemedText style={{ fontSize, marginBottom: 6 }} {...rest} />
)

const Home = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<IPageData['error']>()
    const theme = useColorScheme() ?? 'dark'
    const pageData = useSelector((state: RootState) => state.appData)
    const dispatch = useDispatch()

    const refreshPage = useCallback(async (callback?: Function) => {
        setLoading(true)
        const data = await fetchAllPrices()
        if (data) {
            dispatch(setAppData(data))
        }
        if (!isEmpty(data?.error)) {
            setError(data?.error)
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
        ounce: formatNumber(Number(pageData?.globalPrice?.ounce)),
        tael: formatNumber(Number(pageData?.globalPrice?.tael)),
        usdRate: formatNumber(
            Number(pageData?.globalPrice?.exchangeRateVND?.USD)
        ),
        taelVND: formatPrice(Number(pageData?.globalPrice?.taelVND))
    }

    useEffect(() => {
        refreshPage()
    }, [])

    return (
        <ParallaxScrollView onRefresh={refreshPage} headerHeight={50}>
            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <>
                    {error &&
                        Object.entries(error).map(([key, value]) => (
                            <Text key={key} style={commonStyles.error}>
                                {key}: {value}
                            </Text>
                        ))}
                    <SafeWebView uri={encodedUrl} style={styles.webview} />
                    {/* <View style={styles.usdOzPrice}>
                            <TextLarge>USD Ounce</TextLarge>
                            <TextLarge fontSize={26} type="semiBold">
                                {globalPriceFormatted.ounce}
                            </TextLarge>
                        </View> */}
                    <View>
                        <View style={styles.globalPriceItem}>
                            <TextLarge>USD Ounce</TextLarge>
                            <TextLarge>{globalPriceFormatted.ounce}</TextLarge>
                        </View>
                        <View style={styles.globalPriceItem}>
                            <TextLarge>USD Tael</TextLarge>
                            <TextLarge>{globalPriceFormatted.tael}</TextLarge>
                        </View>
                        <View style={styles.globalPriceItem}>
                            <TextLarge>USD Exchange</TextLarge>
                            <TextLarge>
                                {globalPriceFormatted.usdRate}
                            </TextLarge>
                        </View>
                        <View style={styles.globalPriceItem}>
                            <TextLarge>VND Tael</TextLarge>
                            <TextLarge>
                                {globalPriceFormatted.taelVND}
                            </TextLarge>
                        </View>
                    </View>
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
    },
    usdOzPrice: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        borderColor: '#ccc',
        borderWidth: StyleSheet.hairlineWidth,
        marginBottom: 20,
        padding: 10,
        borderRadius: 5
    }
})

export default Home
