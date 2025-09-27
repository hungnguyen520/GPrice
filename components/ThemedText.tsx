import { Text, type TextProps, StyleSheet } from 'react-native'
import { useThemeColor } from '@/hooks/useThemeColor'

export type ThemedTextProps = TextProps & {
    type?: 'default' | 'title' | 'semiBold' | 'subtitle' | 'link'
}

export function ThemedText({
    style,
    type = 'default',
    ...rest
}: ThemedTextProps) {
    const color = useThemeColor('text')

    return (
        <Text
            style={[
                { color },
                type === 'default' ? styles.default : undefined,
                type === 'title' ? styles.title : undefined,
                type === 'semiBold' ? styles.semiBold : undefined,
                type === 'subtitle' ? styles.subtitle : undefined,
                type === 'link' ? styles.link : undefined,
                style
            ]}
            {...rest}
        />
    )
}

const styles = StyleSheet.create({
    default: {
        fontSize: 16,
        lineHeight: 24
    },
    semiBold: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600'
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        lineHeight: 32
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    link: {
        lineHeight: 30,
        fontSize: 16,
        color: '#0a7ea4'
    }
})
