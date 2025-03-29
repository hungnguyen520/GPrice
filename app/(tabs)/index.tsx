import React, { useCallback, useEffect, useState } from 'react';
import { Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Table from '@/components/Table';
import {
    getGlobalPrice,
    getGlobalPriceURI,
    getGPrices
} from '@/utils/apiFetch';
import { IPageState } from '@/types';
import { WebView } from 'react-native-webview';
import commonStyles, { parallaxIconSize } from '@/styles';
import CustomButton from '@/components/CustomButton';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setAppData } from '@/store/appDataSlice';

const getPageData = async () => {
    const data: IPageState = {};
    const errors: string[] = [];
    const [vnRes, gloRes] = await Promise.allSettled([
        getGPrices(),
        getGlobalPrice()
    ]);

    if (vnRes.status === 'fulfilled') {
        data.prices = vnRes.value
    } else {
        errors.push(vnRes.reason.toString());
    }

    if (gloRes.status === 'fulfilled') {
        data.globalPrice = gloRes.value;
    } else {
        errors.push(gloRes.reason.toString());
    }

    return {
        data,
        errors
    };
};

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);
    const theme = useColorScheme() ?? 'dark';
    const pageData = useSelector((state: RootState) => state.appData)
    const dispatch = useDispatch()

    const refreshPage = useCallback(async (callback?: Function) => {
        setLoading(true);
        const { data, errors } = await getPageData();
        if(data) {
            dispatch(setAppData(data))
        }
        if(errors?.length) {
            setErrors(errors);
        }
        setLoading(false);
        callback?.();
    }, []);
    
    const encodedUrl = getGlobalPriceURI(theme);

    const tableData = pageData?.prices?.map(d => ({
        group: d.group,
        type: d.type,
        buy: d.formatted?.buy,
        sell: d.formatted?.sell
    }));

    const globalPrice = pageData?.globalPrice

    useEffect(() => {
        refreshPage();
    }, []);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={
                <IconSymbol
                    size={parallaxIconSize}
                    color="#808080"
                    name="chevron.left.forwardslash.chevron.right"
                    style={commonStyles.headerImage}
                />
            }
            onRefresh={refreshPage}
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
                        // key={count}
                        source={{ uri: encodedUrl }}
                        style={styles.webview}
                    />
                    {globalPrice && (
                        <View>
                            <View style={styles.globalPriceItem}>
                                <ThemedText>Ounce</ThemedText>
                                <ThemedText>
                                    {globalPrice.formatted?.ounceUSD}
                                </ThemedText>
                            </View>
                            <View style={styles.globalPriceItem}>
                                <ThemedText>Tael</ThemedText>
                                <ThemedText>
                                    {globalPrice.formatted?.taelUSD}
                                </ThemedText>
                            </View>
                            <View style={styles.globalPriceItem}>
                                <ThemedText>Rate USD</ThemedText>
                                <ThemedText>
                                    {globalPrice.formatted?.usdRate}
                                </ThemedText>
                            </View>
                            <View style={styles.globalPriceItem}>
                                <ThemedText>Tael VND</ThemedText>
                                <ThemedText>
                                    {globalPrice.formatted?.taelVND}
                                </ThemedText>
                            </View>
                        </View>
                    )}
                    {tableData?.length && (
                        <View style={styles.tableContainer}>
                            <Table data={tableData} />
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
    );
};

const styles = StyleSheet.create({
    tableContainer: {
        paddingBottom: 0
    },
    webview: {
        flex: 1,
        height: 100,
        backgroundColor: 'transparent'
    },
    globalPriceItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

export default Home;
