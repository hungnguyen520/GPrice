import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import commonStyles, { parallaxIconSize } from '@/styles';
import React from 'react';
import { StyleSheet } from 'react-native';

const GPrice = () => {
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
            <ThemedText>G Price</ThemedText>
        </ParallaxScrollView>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center'
    }
});

export default GPrice;
