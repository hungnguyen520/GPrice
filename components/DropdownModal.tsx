import React, { useEffect } from 'react'
import {
    Modal,
    ScrollView,
    StyleProp,
    TouchableOpacity,
    ViewStyle
} from 'react-native'
import { useState } from 'react'
import { ThemedText } from './ThemedText'
import { ThemedView } from './ThemedView'
import { StyleSheet } from 'react-native'
import { useThemeColor } from '@/hooks/useThemeColor'
import { IconSymbol } from './ui/IconSymbol'

export type DropdownOption = {
    label: string
    value: string | number
}

interface DropdownModalProps {
    options: DropdownOption[]
    onChange: (selected: DropdownOption) => void
    placeholder?: string
    style?: StyleProp<ViewStyle>
}

const DropdownModal: React.FC<DropdownModalProps> = ({
    placeholder,
    options,
    onChange,
    style
}) => {
    const [visible, setVisible] = useState(false)
    const [selected, setSelected] = useState<DropdownOption | null>()
    const textColor = useThemeColor('text')

    useEffect(() => {
        setSelected(null)
    }, [options])

    return (
        <ThemedView style={[styles.wrapper, style]}>
            <TouchableOpacity
                activeOpacity={1}
                style={[
                    styles.input,
                    {
                        borderColor: textColor
                    }
                ]}
                onPress={() => setVisible(true)}
            >
                <ThemedText>
                    {selected?.label || placeholder || 'Select...'}
                </ThemedText>
                <IconSymbol
                    name={visible ? 'chevron.up' : 'chevron.down'}
                    size={18}
                    color={textColor}
                />
            </TouchableOpacity>

            <Modal visible={visible} transparent>
                <TouchableOpacity
                    style={styles.overlay}
                    onPress={() => setVisible(false)}
                >
                    {options?.length ? (
                        <ScrollView
                            style={[
                                styles.scrollView,
                                {
                                    backgroundColor: textColor
                                }
                            ]}
                        >
                            {options.map((item) => (
                                <TouchableOpacity
                                    key={item.value}
                                    onPress={() => {
                                        setSelected(item)
                                        onChange?.(item)
                                        setVisible(false)
                                    }}
                                >
                                    <ThemedText style={styles.option}>
                                        {item.label}
                                    </ThemedText>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    ) : (
                        <></>
                    )}
                </TouchableOpacity>
            </Modal>
        </ThemedView>
    )
}

export default DropdownModal

const styles = StyleSheet.create({
    wrapper: {
        // flex: 1
    },
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
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    scrollView: {
        maxWidth: '50%',
        maxHeight: '70%',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        overflowX: 'hidden',
        overflowY: 'auto'
    },
    option: {
        padding: 10
    }
})
