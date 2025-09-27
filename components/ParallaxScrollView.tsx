import { ThemedView } from '@/components/ThemedView'
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground'
import { useThemeColor } from '@/hooks/useThemeColor'
import type { PropsWithChildren, ReactElement } from 'react'
import React from 'react'
import {
    Image,
    ImageSourcePropType,
    RefreshControl,
    StyleSheet,
    View
} from 'react-native'
import Animated, {
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset
} from 'react-native-reanimated'

const HEADER_HEIGHT = 180

type Props = PropsWithChildren<{
    headerImage?: ReactElement
    onRefresh?: (callback?: Function) => void
    headerHeight?: number
    backgroundImage?: ImageSourcePropType
}>

export default function ParallaxScrollView({
    children,
    headerImage,
    onRefresh,
    headerHeight = HEADER_HEIGHT,
    backgroundImage = require('@/assets/images/hd-city-home-tab.jpg')
}: Props) {
    const backgroundColor = useThemeColor('background')
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

    return (
        <ThemedView style={styles.container}>
            <Image
                key={'blurryImage'}
                source={backgroundImage}
                resizeMode="cover"
                style={styles.absolute}
            />
            <View style={styles.absolute} />
            <Animated.ScrollView
                ref={scrollRef}
                scrollEventThrottle={16}
                scrollIndicatorInsets={{ bottom }}
                contentContainerStyle={{ paddingBottom: bottom }}
                horizontal={false}
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={onRefresh} />
                }
            >
                {headerImage ? (
                    <Animated.View
                        style={[
                            styles.header,
                            { height: headerHeight },
                            {
                                backgroundColor: backgroundColor
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
        height: '100%',
        backgroundColor: 'black',
        opacity: 0.5
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
