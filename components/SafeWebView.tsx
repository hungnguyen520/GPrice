import React from 'react'
import { WebView, WebViewNavigation, WebViewProps } from 'react-native-webview'

type SafeWebViewProps = WebViewProps & {
    uri: string
    allowedDomains?: string[]
}

export const SafeWebView: React.FC<SafeWebViewProps> = ({
    uri,
    style,
    allowedDomains
}) => {
    const handleShouldStart = (request: WebViewNavigation) => {
        const url = request.url

        if (url.startsWith('javascript:')) {
            console.warn('Blocked unsafe javascript URL:', url)
            return false
        }

        try {
            const { hostname, protocol } = new URL(url)
            if (protocol === 'https:') {
                if (
                    allowedDomains?.length &&
                    !allowedDomains.some((d) => hostname.endsWith(d))
                ) {
                    return false
                }
                return true
            }
        } catch (e) {
            console.warn('Invalid URL blocked:', url)
            return false
        }

        return false
    }

    return (
        <>
            <WebView
                source={{ uri }}
                style={style}
                originWhitelist={['https://*']}
                javaScriptEnabled={true}
                domStorageEnabled={false}
                allowFileAccess={false}
                allowingUniversalAccessFromFileURLs={false}
                allowFileAccessFromFileURLs={false}
                mixedContentMode="never"
                onShouldStartLoadWithRequest={handleShouldStart}
                injectedJavaScriptBeforeContentLoaded={`
                    window.alert = function() {};
                    window.prompt = function() {};
                    window.confirm = function() {};
                `}
            />
        </>
    )
}
