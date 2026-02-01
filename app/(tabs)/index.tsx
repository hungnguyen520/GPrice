import CustomButton from '@/components/CustomButton'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { SafeWebView } from '@/components/SafeWebView'
import Table from '@/components/Table'
import { ThemedText } from '@/components/ThemedText'
import { useColorScheme } from 'react-native'
import { RootState } from '@/store'
import {
    setGlobalPrice,
    setDomesticPrice,
    clearData
} from '@/store/appDataSlice'
import commonStyles from '@/styles'
import { PriceError } from '@/types'
import {
    fetchDOJIPriceXML,
    fetchGlobalPrice,
    fetchPNJPrice,
    fetchSJCPrice,
    getGlobalPriceURI
} from '@/utils/apiFetch'
import { formatNumber, formatPrice } from '@/utils/numberFormat'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const TextLarge = ({ fontSize = 18, ...rest }) => (
    <ThemedText style={{ fontSize, marginBottom: 6 }} {...rest} />
)

const Home = () => {
    const theme = useColorScheme() ?? 'dark'

    const [error, setError] = useState<PriceError>()
    const pageData = useSelector((state: RootState) => state.appData)
    const dispatch = useDispatch()

    const abortController = useRef<AbortController>()

    const catchError = useCallback((key: keyof PriceError, error: any) => {
        if (error.name !== 'CanceledError') {
            setError((prev) => ({ ...prev, [key]: error.message }))
        }
    }, [])

    const abortFetches = () => {
        if (abortController.current) {
            abortController.current.abort()
        }
    }

    const loadData = useCallback(async () => {
        const controller = new AbortController()
        abortController.current = controller

        // Fetch and set global price
        fetchGlobalPrice(controller.signal)
            .then((data) => {
                return dispatch(setGlobalPrice(data))
            })
            .catch((error) => catchError('global', error))

        // Fetch and set sjc prices
        fetchSJCPrice(controller.signal)
            .then((data) => {
                dispatch(setDomesticPrice(data))
                if (data.SJC_R) {
                    const nmSell = data.SJC_R.sell - 7000000
                    const nmBuy = nmSell - 1500000
                    const nmData = { NM: { buy: nmBuy, sell: nmSell } }
                    dispatch(setDomesticPrice(nmData))
                }
            })
            .catch((error) => catchError('sjc', error))

        // Fetch and set doji prices
        fetchDOJIPriceXML(controller.signal)
            .then((data) => {
                dispatch(setDomesticPrice(data))
            })
            .catch((error) => catchError('doji', error))

        // Fetch and set pnj prices
        fetchPNJPrice(controller.signal)
            .then((data) => {
                dispatch(setDomesticPrice(data))
            })
            .catch((error) => catchError('pnj', error))
    }, [])

    const encodedUrl = useMemo(() => getGlobalPriceURI(theme), [theme])

    const domesticTableData = [
        { group: 'SJC', buy: '-', sell: '-' },
        { group: 'SJC_R', buy: '-', sell: '-' },
        { group: 'DOJI', buy: '-', sell: '-' },
        { group: 'PNJ', buy: '-', sell: '-' },
        { group: 'NM', buy: '-', sell: '-' }
    ]

    if (pageData?.domesticPrice) {
        Object.keys(pageData.domesticPrice).forEach((key) => {
            const price = pageData.domesticPrice?.[key]
            const foundRow = domesticTableData.find((row) => row.group === key)
            if (!foundRow) return
            foundRow.buy = formatPrice(price?.buy || 0)
            foundRow.sell = formatPrice(price?.sell || 0)
        })
    }

    const globalPriceFormatted = pageData?.globalPrice
        ? {
              ounce: formatNumber(Number(pageData.globalPrice?.ounce)),
              tael: formatNumber(Number(pageData?.globalPrice?.tael)),
              usdRate: formatNumber(
                  Number(pageData?.globalPrice?.exchangeRateVND?.USD)
              ),
              taelVND: formatPrice(Number(pageData?.globalPrice?.taelVND))
          }
        : { ounce: '-', tael: '-', usdRate: '-', taelVND: '-' }

    useEffect(() => {
        loadData()
        return () => abortFetches()
    }, [])

    const refreshPage = () => {
        abortFetches()
        setError({})
        dispatch(clearData())
        loadData()
    }

    return (
        <ParallaxScrollView onRefresh={refreshPage} headerHeight={50}>
            {error &&
                Object.entries(error).map(([key, value]) => (
                    <Text key={key} style={commonStyles.error}>
                        {key}: {value}
                    </Text>
                ))}
            <SafeWebView uri={encodedUrl} style={styles.webview} />
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
                    <TextLarge>{globalPriceFormatted.usdRate}</TextLarge>
                </View>
                <View style={styles.globalPriceItem}>
                    <TextLarge>VND Tael</TextLarge>
                    <TextLarge>{globalPriceFormatted.taelVND}</TextLarge>
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
                onPress={refreshPage}
            />
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
