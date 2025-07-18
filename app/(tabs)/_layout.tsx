import { Tabs } from 'expo-router'
import React from 'react'
import { Platform } from 'react-native'
import { HapticTab } from '@/components/HapticTab'
import { IconSymbol } from '@/components/ui/IconSymbol'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'

function TabLayout() {
    const colorScheme = useColorScheme()

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                // tabBarBackground: TabBarBackground,
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
