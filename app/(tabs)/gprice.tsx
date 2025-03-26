import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import commonStyles from '@/styles';
import React from 'react';
import { Text, StyleSheet, }from 'react-native';


const GPrice = () => {

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
        <Text>G price</Text>
        </ParallaxScrollView>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
});

export default GPrice;