import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, TouchableOpacityProps, ColorValue } from 'react-native';
import { IconSymbol, IconSymbolName } from '@/components/ui/IconSymbol';

interface CustomButtonProps extends TouchableOpacityProps {
    title?: string
    iconName?: IconSymbolName
    backgroundColor?: ColorValue
    borderColor?: ColorValue
    textColor?: ColorValue
    iconColor?: ColorValue
    iconSize?: number
}

const CustomButton: React.FC<CustomButtonProps> = ({
    onPress,
    title,
    iconName = 'chevron.left.forwardslash.chevron.right' as IconSymbolName,
    backgroundColor = 'green',
    borderColor = 'white',
    textColor = 'white',
    iconColor = 'white',
    iconSize = 20,
    style
}) => {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor, borderColor }, style]}
            onPress={onPress}
        >
            <View style={styles.buttonContent}>
                {iconName && <IconSymbol
                    name={iconName}
                    size={iconSize}
                    color={iconColor}
                    style={styles.icon}
                />}
                {title && <Text style={[styles.buttonText, { color: textColor }]}>
                    {title}
                </Text>}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderWidth: 1
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10
    },
    icon: {
        marginRight: 10
    }
});

export default CustomButton;
