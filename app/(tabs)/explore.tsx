import CustomButton from '@/components/CustomButton'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { PriceView } from '@/components/PriceView'
import SelectDropdown, { DropdownOption } from '@/components/SelectDropdown'
import { TextInput } from '@/components/TextInput'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { CHANNEL_SELECTION } from '@/constants/lottery.constant'
import { ILotteryDrawResult, ILotteryDrawTable } from '@/types'
import { fetchXSMN } from '@/utils/xsmn'
import { cloneDeep } from 'lodash'
import { useState } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'

export default function Explore() {
    const [result, setResult] = useState<ILotteryDrawResult | null>()
    const [dateOptions, setDateOptions] = useState<DropdownOption[]>([])
    const [searchedTable, setSearchedTable] =
        useState<ILotteryDrawTable | null>()
    const [selectedTable, setSelectedTable] =
        useState<ILotteryDrawTable | null>()

    const resetPage = () => {
        setResult(undefined)
        setSelectedTable(null)
        setSearchedTable(null)
        setDateOptions([])
    }

    const onSelectURL = (drawableURL: string) => {
        resetPage()
        setResult(null) // For loading
        fetchXSMN(drawableURL).then((r) => {
            const { dataTables } = r
            const dates = dataTables.map((d) => {
                return {
                    label: d.date,
                    value: d.date
                }
            })
            setResult(r)
            setDateOptions(dates)
        })
    }

    const onSelectDate = (selectedDate: string) => {
        if (selectedDate) {
            const selectedTable = result?.dataTables?.find(
                (t) => t.date === selectedDate
            )
            if (selectedTable) {
                setSelectedTable(selectedTable)
            }
        }
    }

    const onInputChange = (text: string) => {
        const length = text.length
        if (selectedTable && length) {
            const checkFields = [
                'price1',
                'price2',
                'price3',
                'price4',
                'price5',
                'price6',
                'price7',
                'price8',
                'priceS'
            ]
            const _searchedTable = cloneDeep(selectedTable)

            checkFields.forEach((field) => {
                const items = selectedTable[field].filter((n) => {
                    return n.toString().slice(-length) === text
                })
                _searchedTable[field] = items
            })
            setSearchedTable(_searchedTable)
        } else {
            setSearchedTable(null)
        }
    }

    const renderingTables = searchedTable
        ? [searchedTable]
        : selectedTable
        ? [selectedTable]
        : result?.dataTables

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerHeight={50}
            backgroundImage={require('@/assets/images/hd-city-2nd-tab2.jpg')}
        >
            <ThemedView style={styles.selections}>
                <SelectDropdown
                    key={'channel'}
                    style={styles.dropdown}
                    options={CHANNEL_SELECTION}
                    onChange={({ value }) => onSelectURL(value as string)}
                    placeholder={'Channel...'}
                />
                <SelectDropdown
                    key={'date'}
                    style={styles.dropdown}
                    options={dateOptions}
                    onChange={({ value }) => onSelectDate(value as string)}
                    placeholder={'Date...'}
                />
            </ThemedView>
            {selectedTable && (
                <ThemedView style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="Your last ticket numbers..."
                        onChangeText={(v) => onInputChange(v)}
                    />
                </ThemedView>
            )}
            {result && (
                <>
                    <ThemedText style={styles.title} type="subtitle">
                        {result?.pageTitle}
                    </ThemedText>
                    {renderingTables?.map((dataTable: ILotteryDrawTable) => {
                        return <PriceView {...dataTable} key={dataTable.date} />
                    })}
                    <CustomButton
                        iconName="arrow.2.circlepath"
                        borderColor={'white'}
                        iconColor={'white'}
                        backgroundColor={'transparent'}
                        onPress={() => resetPage()}
                    />
                </>
            )}
            {result === null && <ActivityIndicator size="large" />}
        </ParallaxScrollView>
    )
}

const styles = StyleSheet.create({
    title: {
        textAlign: 'center'
    },
    selections: {
        flex: 1,
        flexDirection: 'row',
        gap: 16,
        backgroundColor: 'transparent',
        marginBottom: 4
    },
    dropdown: {
        flex: 1
    },
    input: {
        fontWeight: 600,
        fontSize: 18
    },
    inputWrapper: {
        marginBottom: 6
    }
})
