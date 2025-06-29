import { ActivityIndicator, StyleSheet } from 'react-native'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useEffect, useState } from 'react'
import DropdownModal, { DropdownOption } from '@/components/DropdownModal'
import { CHANNEL_SELECTION } from '@/constants/lottery.constant'
import { PriceView } from '@/components/PriceView'
import { ILotteryDrawResult, ILotteryDrawTable } from '@/types'
import { fetchXSMN } from '@/utils/xsmn'

export default function Sample() {
    const [result, setResult] = useState<ILotteryDrawResult | null>()
    const [dateOptions, setDateOptions] = useState<DropdownOption[]>([])
    const [selectedTable, setSelectedTable] =
        useState<ILotteryDrawTable | null>()

    const onSelectURL = (drawableURL: string) => {
        setResult(null)
        setSelectedTable(null)
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

    const renderingTables = selectedTable ? [selectedTable] : result?.dataTables

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerHeight={50}
            backgroundImage={require('@/assets/images/hd-city-2nd-tab2.jpg')}
        >
            <ThemedView style={styles.selection}>
                <DropdownModal
                    options={CHANNEL_SELECTION}
                    onChange={({ value }) => onSelectURL(value as string)}
                    placeholder={'Select channel...'}
                />
            </ThemedView>
            <ThemedView style={styles.selection}>
                <DropdownModal
                    options={dateOptions}
                    onChange={({ value }) => onSelectDate(value as string)}
                    placeholder={'Select date...'}
                />
            </ThemedView>
            {result && (
                <>
                    <ThemedText style={styles.title} type="subtitle">
                        {result?.pageTitle}
                    </ThemedText>
                    {renderingTables?.map((dataTable: ILotteryDrawTable) => {
                        return <PriceView {...dataTable} key={dataTable.date} />
                    })}
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
    selection: {
        backgroundColor: 'transparent',
        marginBottom: 8
    }
})
