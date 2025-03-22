import React, { useEffect, useState } from 'react';
import { Text, ActivityIndicator, StyleSheet, Button } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Table from '@/components/Table';
import { getGlobalPriceURI, getGPrices } from '@/utils/apiFetch';
import { IPriceData } from '@/types';
import useForceRender from '@/hooks/useForceRender';
import { WebView } from 'react-native-webview';

const GPrice = () => {
    const [prices, setPrices] = useState<IPriceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const { count, reRender } = useForceRender()

    useEffect(() => {
        setLoading(true)
        getGPrices().then((data) => {
            setPrices(data)
        }).catch((err) => {
            setError(err.toString())
        }).finally(() => {
            setLoading(false)
        })

    }, [count]);

    const encodedUrl = getGlobalPriceURI()

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={
                <IconSymbol
                    size={310}
                    color="#808080"
                    name="chevron.left.forwardslash.chevron.right"
                    style={styles.headerImage}
                />
            }>

            <WebView
                key={count}
                source={{ uri: encodedUrl }}
                style={styles.webview}
            />

            {loading ? <ActivityIndicator size="large" /> : (
                <>
                    {error && <Text style={styles.error}>{error}</Text>}
                    {prices.length && <Table key={count} data={prices} />}
                </>
            )}

            <Button title='Refresh' onPress={() => reRender()} />
        </ParallaxScrollView>
    );
};

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    priceText: {
        fontSize: 16,
        marginBottom: 8,
    },
    error: {
        color: 'red',
        textAlign: 'center',
    },
    webview: {
        flex: 1,
        height: 90
    },
});

export default GPrice;