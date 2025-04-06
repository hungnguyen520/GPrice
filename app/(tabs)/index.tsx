import React, { useCallback, useEffect, useState } from 'react'
import { Text, ActivityIndicator, StyleSheet, View } from 'react-native'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import Table from '@/components/Table'
import { getGlobalPrice, getGlobalPriceURI, getGPrices } from '@/utils/apiFetch'
import { IPageState } from '@/types'
import { WebView } from 'react-native-webview'
import commonStyles from '@/styles'
import CustomButton from '@/components/CustomButton'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { setAppData } from '@/store/appDataSlice'
import { ThemedText } from '@/components/ThemedText'

const getPageData = async () => {
    const data: IPageState = {}
    const errors: string[] = []
    const [vnRes, gloRes] = await Promise.allSettled([
        getGPrices(),
        getGlobalPrice()
    ])

    if (vnRes.status === 'fulfilled') {
        data.prices = vnRes.value
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

    const tableData = pageData?.prices?.map((d) => ({
        group: d.group,
        buy: d.formatted?.buy,
        sell: d.formatted?.sell
    }))

    const globalPrice = pageData?.globalPrice

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
                    <WebView
                        source={{ uri: encodedUrl }}
                        style={styles.webview}
                    />
                    {globalPrice && (
                        <View>
                            <View style={styles.globalPriceItem}>
                                <TextLarge>Ounce</TextLarge>
                                <TextLarge>
                                    {globalPrice.formatted?.ounceUSD}
                                </TextLarge>
                            </View>
                            <View style={styles.globalPriceItem}>
                                <TextLarge>Tael</TextLarge>
                                <TextLarge>
                                    {globalPrice.formatted?.taelUSD}
                                </TextLarge>
                            </View>
                            <View style={styles.globalPriceItem}>
                                <TextLarge style={{ fontSize: 20 }}>
                                    Rate USD
                                </TextLarge>
                                <TextLarge>
                                    {globalPrice.formatted?.usdRate}
                                </TextLarge>
                            </View>
                            <View style={styles.globalPriceItem}>
                                <TextLarge>Tael VND</TextLarge>
                                <TextLarge>
                                    {globalPrice.formatted?.taelVND}
                                </TextLarge>
                            </View>
                        </View>
                    )}
                    {tableData?.length && (
                        <View style={styles.tableContainer}>
                            <Table
                                data={tableData}
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
