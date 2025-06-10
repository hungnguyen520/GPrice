import React from 'react'
import { Modal, ScrollView, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { ThemedText } from './ThemedText'
import { ThemedView } from './ThemedView'
import { StyleSheet } from 'react-native'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useColorScheme } from '@/hooks/useColorScheme'
import { IconSymbol } from './ui/IconSymbol'

type DropdownOption = {
    label: string
    value: string | number
}

interface DropdownModalProps {
    options: DropdownOption[]
    onChange: (selected: DropdownOption) => void
}

const DropdownModal: React.FC<DropdownModalProps> = ({ options, onChange }) => {
    const [visible, setVisible] = useState(false)
    const [selected, setSelected] = useState<DropdownOption>()
    const themedColor = useThemeColor({}, 'text')
    const theme = useColorScheme() ?? 'light'

    return (
        <ThemedView style={styles.wrapper}>
            <TouchableOpacity
                activeOpacity={1}
                style={[
                    styles.input,
                    {
                        borderColor: themedColor
                    }
                ]}
                onPress={() => setVisible(true)}
            >
                <ThemedText>{selected?.label || 'Select...'}</ThemedText>
                <IconSymbol
                    name={visible ? 'chevron.up' : 'chevron.down'}
                    size={18}
                    color={themedColor}
                />
            </TouchableOpacity>

            <Modal visible={visible} transparent>
                <TouchableOpacity
                    style={styles.overlay}
                    onPress={() => setVisible(false)}
                >
                    <ScrollView
                        style={[
                            styles.content,
                            {
                                backgroundColor:
                                    theme === 'dark' ? '#444' : 'white'
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
        paddingVertical: 5
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    content: {
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
