import { useThemeColor } from '@/hooks/useThemeColor'
import React from 'react'
import { TextInput as NativeTextInput, TextInputProps } from 'react-native'
import { StyleSheet } from 'react-native'

export const TextInput = (props: TextInputProps) => {
    const { style, ...rest } = props
    const textColor = useThemeColor('text')

    return (
        <NativeTextInput
            style={[
                styles.input,
                { color: textColor, borderColor: textColor },
                style
            ]}
            {...rest}
        />
    )
}

const styles = StyleSheet.create({
    input: {
        borderRadius: 4,
        height: 40,
        borderWidth: 1,
        padding: 10
    }
})
