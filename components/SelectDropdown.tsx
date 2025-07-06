import { useThemeColor } from '@/hooks/useThemeColor'
import React from 'react'
import { StyleProp, StyleSheet, Text, ViewStyle } from 'react-native'
import NativeSelectDropdown from 'react-native-select-dropdown'
import { ThemedText } from './ThemedText'
import { ThemedView } from './ThemedView'
import { IconSymbol } from './ui/IconSymbol'

export type DropdownOption = {
    label: string
    value: string | number
}

interface SelectDropdownProps {
    options: DropdownOption[]
    onChange: (selected: DropdownOption) => void
    placeholder?: string
    style?: StyleProp<ViewStyle>
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
    placeholder,
    options,
    onChange,
    style
}) => {
    const themedColor = useThemeColor({}, 'text')
    // const theme = useColorScheme() ?? 'light'

    return (
        <NativeSelectDropdown
            data={options}
            onSelect={onChange}
            renderButton={(selectedItem, isOpened) => {
                return (
                    <ThemedView
                        style={[
                            styles.input,
                            {
                                borderColor: themedColor
                            }
                        ]}
                    >
                        <ThemedText>
                            {selectedItem?.label || placeholder || 'Select...'}
                        </ThemedText>
                        <IconSymbol
                            name={isOpened ? 'chevron.up' : 'chevron.down'}
                            size={18}
                            color={themedColor}
                        />
                    </ThemedView>
                )
            }}
            renderItem={(item, index, isSelected) => {
                return (
                    <ThemedView style={styles.option}>
                        <Text style={isSelected && { fontWeight: '600' }}>
                            {item.label}
                        </Text>
                    </ThemedView>
                )
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={style}
        />
    )
}

export default SelectDropdown

const styles = StyleSheet.create({
    input: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        paddingHorizontal: 10,
        paddingVertical: 8
    },
    option: {
        padding: 10
    }
})
