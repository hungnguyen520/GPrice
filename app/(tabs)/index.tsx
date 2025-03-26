import React, { useEffect, useState } from 'react';
import { Text, ActivityIndicator, StyleSheet, Button, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Table from '@/components/Table';
import { getGlobalPrice, getGlobalPriceURI, getGPrices } from '@/utils/apiFetch';
import { IPriceData } from '@/types';
import useForceRender from '@/hooks/useForceRender';
import { WebView } from 'react-native-webview';
import commonStyles from '@/styles';
import CustomButton from '@/components/CustomButton';
import { useColorScheme } from '@/hooks/useColorScheme';

const Home = () => {
    const [prices, setPrices] = useState<IPriceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const { count, reRender } = useForceRender();
    const theme = useColorScheme() ?? 'dark';

    useEffect(() => {
        setLoading(true);
        getGPrices()
            .then((data) => {
                setPrices(data);
            })
            .catch((err) => {
                setError(err.toString());
            })
            .finally(() => {
                setLoading(false);
            });
            getGlobalPrice()
    }, [count]);

    const encodedUrl = getGlobalPriceURI(theme);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={
                <IconSymbol
                    size={310}
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
                    {error && <Text style={commonStyles.error}>{error}</Text>}
                    {prices.length &&  <View style={styles.container}><Table data={prices} /></View>}
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
    container: {
        paddingBottom: 16,
        paddingTop: 16
    },
    webview: {
        flex: 1,
        height: 100,
        backgroundColor: 'transparent'
    }
});

export default Home;
