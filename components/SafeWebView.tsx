import React from 'react'
import { WebView, WebViewProps } from 'react-native-webview'

type SafeWebViewProps = WebViewProps & {
    uri?: string | null
}

const isValidUrl = (url: string): boolean => {
    try {
        const parsed = new URL(url)
        // Only allow http/https schemes (no javascript:, file:, etc.)
        return ['http:', 'https:'].includes(parsed.protocol)
    } catch {
        return false
    }
}

export const SafeWebView: React.FC<SafeWebViewProps> = ({ uri, ...props }) => {
    let source

    if (uri && isValidUrl(uri)) {
        source = { uri }
    } else {
        source = { html: '<h3>Content unavailable</h3>' }
    }

    return (
        <WebView
            {...props}
            source={source}
            originWhitelist={['http://*', 'https://*']}
            javaScriptEnabled={true}
            domStorageEnabled={true}
        />
    )
}
