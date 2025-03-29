import type { PropsWithChildren, ReactElement } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';

const HEADER_HEIGHT = 180;

type Props = PropsWithChildren<{
    headerImage: ReactElement;
    headerBackgroundColor: { dark: string; light: string };
    onRefresh?: (callback: Function) => void;
}>;

export default function ParallaxScrollView({
    children,
    headerImage,
    headerBackgroundColor,
    onRefresh
}: Props) {
    const colorScheme = useColorScheme() ?? 'light';
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useScrollViewOffset(scrollRef);
    const bottom = useBottomTabOverflow();
    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollOffset.value,
                        [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
                        [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
                    )
                },
                {
                    scale: interpolate(
                        scrollOffset.value,
                        [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
                        [2, 1, 1]
                    )
                }
            ]
        };
    });
    const [refreshing, setRefreshing] = React.useState(false);

    const _onRefresh = React.useCallback(() => {
        if (onRefresh) {
            setRefreshing(true);
            const callback = () => setRefreshing(false);
            onRefresh(callback);
        }
        // setTimeout(() => {
        //     setRefreshing(false);
        // }, 3000);
    }, []);

    return (
        <ThemedView style={styles.container}>
            <Animated.ScrollView
                ref={scrollRef}
                scrollEventThrottle={16}
                scrollIndicatorInsets={{ bottom }}
                contentContainerStyle={{ paddingBottom: bottom }}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={_onRefresh}
                    />
                }
            >
                <Animated.View
                    style={[
                        styles.header,
                        { backgroundColor: headerBackgroundColor[colorScheme] },
                        headerAnimatedStyle
                    ]}
                >
                    {headerImage}
                </Animated.View>
                <ThemedView style={styles.content}>{children}</ThemedView>
            </Animated.ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        height: HEADER_HEIGHT,
        overflow: 'hidden'
    },
    content: {
        flex: 1,
        paddingTop: 32,
        paddingHorizontal: 24,
        paddingBottom: 52,
        gap: 16,
        overflow: 'hidden'
    }
});
