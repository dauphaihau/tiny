# Tiny

A mobile social networking application built with Expo and React Native.

## Features

- Real-time posts and interactions
- Profile management
- Post creation with image support
- Reply system
- Like functionality
- Search capabilities
- Infinite scrolling for content loading

## Tech Stack

- **Frontend**: React Native, Expo
- **Backend**: Supabase
- **Styling**: NativeWind (TailwindCSS for React Native)
- **State Management**: React Query
- **Authentication**: Supabase Auth

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/dauphaihau/tiny.git
cd tiny
```

2. Install dependencies:
```bash
cd mobile
npm install
```

3. Set up environment variables:
   Create a `.env` file in the mobile directory with your Supabase configuration:
```plaintext
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing on Physical Device

1. Download Expo Go app:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code below to open the app in Expo Go:

   <img src="./assets/images/preview-app-qr-code.png" alt="Expo QR Code" width="200" height="200"/>

   - iOS: Use your device's camera app
   - Android: Use the Expo Go app's QR scanner

