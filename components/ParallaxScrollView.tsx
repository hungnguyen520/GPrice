import React from 'react'
import type { PropsWithChildren, ReactElement } from 'react'
import {
    RefreshControl,
    StyleSheet,
    Image,
    View,
    ImageSourcePropType
} from 'react-native'
import Animated, {
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset
} from 'react-native-reanimated'

import { ThemedView } from '@/components/ThemedView'
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground'
import { useColorScheme } from '@/hooks/useColorScheme'
import { BlurView } from '@react-native-community/blur'

const HEADER_HEIGHT = 180

type Props = PropsWithChildren<{
    headerBackgroundColor: { dark: string; light: string }
    headerImage?: ReactElement
    onRefresh?: (callback: Function) => void
    headerHeight?: number
    backgroundImage?: ImageSourcePropType
}>

export default function ParallaxScrollView({
    children,
    headerImage,
    headerBackgroundColor,
    onRefresh,
    headerHeight = HEADER_HEIGHT,
    backgroundImage
}: Props) {
    const colorScheme = useColorScheme() ?? 'light'
    const scrollRef = useAnimatedRef<Animated.ScrollView>()
    const scrollOffset = useScrollViewOffset(scrollRef)
    const bottom = useBottomTabOverflow()
    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollOffset.value,
                        [-headerHeight, 0, headerHeight],
                        [-headerHeight / 2, 0, headerHeight * 0.75]
                    )
                },
                {
                    scale: interpolate(
                        scrollOffset.value,
                        [-headerHeight, 0, headerHeight],
                        [2, 1, 1]
                    )
                }
            ]
        }
    })
    const [refreshing, setRefreshing] = React.useState(false)

    const _onRefresh = React.useCallback(() => {
        if (onRefresh) {
            setRefreshing(true)
            const callback = () => setRefreshing(false)
            onRefresh(callback)
        }
        // setTimeout(() => {
        //     setRefreshing(false);
        // }, 3000);
    }, [])

    const _backgroundImage =
        backgroundImage ?? require('@/assets/images/hd-city-home-tab.jpg')

    return (
        <ThemedView style={styles.container}>
            <Image
                key={'blurryImage'}
                source={_backgroundImage}
                resizeMode="cover"
                style={styles.absolute}
            />
            <BlurView
                style={styles.absolute}
                blurType="dark"
                blurAmount={2}
                reducedTransparencyFallbackColor="white"
            />
            <Animated.ScrollView
                ref={scrollRef}
                scrollEventThrottle={16}
                scrollIndicatorInsets={{ bottom }}
                contentContainerStyle={{ paddingBottom: bottom }}
                horizontal={false}
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={_onRefresh} />
                }
            >
                {headerImage ? (
                    <Animated.View
                        style={[
                            styles.header,
                            { height: headerHeight },
                            {
                                backgroundColor:
                                    headerBackgroundColor[colorScheme]
                            },
                            headerAnimatedStyle
                        ]}
                    >
                        {headerImage}
                    </Animated.View>
                ) : (
                    <View style={[styles.header, { height: headerHeight }]} />
                )}
                <ThemedView style={styles.content}>{children}</ThemedView>
            </Animated.ScrollView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        overflow: 'hidden'
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    },
    content: {
        flex: 1,
        paddingTop: 32,
        paddingHorizontal: 24,
        paddingBottom: 52,
        gap: 16,
        overflow: 'hidden',
        backgroundColor: 'transparent'
    }
})
