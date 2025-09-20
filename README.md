# React Native – Enabling HTTP Requests (Non-HTTPS)

By default, React Native apps block **plain HTTP** (non-HTTPS) requests for security reasons.  
This behavior comes from:

-   **iOS**: App Transport Security (ATS)
-   **Android**: Cleartext traffic policy

If you need to connect to a local development server or an API that only supports HTTP, you must configure both platforms.

---

## 📱 iOS Setup (App Transport Security)

1. Open your project’s **Info.plist** file: ios/YourAppName/Info.plist

2. To allow **all HTTP requests** (not recommended for production), add:

```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
</dict>
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSExceptionDomains</key>
  <dict>
    <key>example.com</key>
    <dict>
      <key>NSIncludesSubdomains</key>
      <true/>
      <key>NSExceptionAllowsInsecureHTTPLoads</key>
      <true/>
    </dict>
  </dict>
</dict>

```
