import { Tabs } from 'expo-router'
import React from 'react'
import { Platform } from 'react-native'
import { HapticTab } from '@/components/HapticTab'
import { IconSymbol } from '@/components/ui/IconSymbol'
import { useThemeColor } from '@/hooks/useThemeColor'

function TabLayout() {
    const tintColor = useThemeColor('tint')

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: tintColor,
                headerShown: false,
                tabBarButton: HapticTab,
                // tabBarBackground: undefined,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: 'absolute',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        paddingTop: 12
                    },
                    default: {}
                })
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="house.fill" color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="gprice"
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={28}
                            name="dollarsign.circle"
                            color={color}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="message" color={color} />
                    )
                }}
            />
        </Tabs>
    )
}

export default TabLayout
