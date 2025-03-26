import React, { useEffect, useState } from 'react';
import { Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Table from '@/components/Table';
import {
    getGlobalPrice,
    getGlobalPriceURI,
    getGPrices
} from '@/utils/apiFetch';
import { IGlobalPrice, IPriceData } from '@/types';
import useForceRender from '@/hooks/useForceRender';
import { WebView } from 'react-native-webview';
import commonStyles, { parallaxIconSize } from '@/styles';
import CustomButton from '@/components/CustomButton';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';

interface IPageState {
    prices?: IPriceData[];
    globalPrice?: IGlobalPrice;
}

const getPageData = async () => {
    const data: IPageState = {};
    const errors: string[] = [];
    const [vnRes, gloRes] = await Promise.allSettled([
        getGPrices,
        getGlobalPrice
    ]);

    if (vnRes.status === 'fulfilled') {
        data.prices = await vnRes.value();
    } else {
        errors.push(vnRes.reason.toString());
    }

    if (gloRes.status === 'fulfilled') {
        data.globalPrice = await gloRes.value();
    } else {
        errors.push(gloRes.reason.toString());
    }

    return {
        data,
        errors
    };
};

const Home = () => {
    const [pageData, setPageData] = useState<IPageState>();
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);
    const { count, reRender } = useForceRender();
    const theme = useColorScheme() ?? 'dark';

    useEffect(() => {
        setLoading(true);
        getPageData()
            .then(({ data, errors }) => {
                setPageData(data);
                setErrors(errors);
            })
            .catch((err) => {
                setErrors([err.toString()]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [count]);

    const encodedUrl = getGlobalPriceURI(theme);

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
        >
            <WebView
                key={count}
                source={{ uri: encodedUrl }}
                style={styles.webview}
            />

            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <>
                    {errors?.map((err, idx) => (
                        <Text key={idx} style={commonStyles.error}>
                            {err}
                        </Text>
                    ))}
                    {pageData?.globalPrice && (
                        <View>
                            <View style={styles.globalPriceItem}>
                                <ThemedText>Ounce</ThemedText>
                                <ThemedText>
                                    {pageData.globalPrice.ounceUSD}
                                </ThemedText>
                            </View>
                            <View style={styles.globalPriceItem}>
                                <ThemedText>Tael</ThemedText>
                                <ThemedText>
                                    {pageData.globalPrice.taelUSD}
                                </ThemedText>
                            </View>
                            <View style={styles.globalPriceItem}>
                                <ThemedText>Rate USD</ThemedText>
                                <ThemedText>
                                    {pageData.globalPrice.usdRate}
                                </ThemedText>
                            </View>
                            <View style={styles.globalPriceItem}>
                                <ThemedText>Tael VND</ThemedText>
                                <ThemedText>
                                    {pageData.globalPrice.taelVND}
                                </ThemedText>
                            </View>
                        </View>
                    )}
                    {pageData?.prices?.length && (
                        <View style={styles.tableContainer}>
                            <Table data={pageData.prices} />
                        </View>
                    )}
                </>
            )}

            <CustomButton
                iconName="arrow.2.circlepath"
                borderColor={'green'}
                iconColor={'green'}
                backgroundColor={'transparent'}
                onPress={() => reRender()}
            />
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
