
import {SplashScreen, Stack} from 'expo-router';

import '../global.css';
import {useFonts} from 'expo-font'
import {useEffect} from "react";
import {any} from "prop-types";
import GlobalProvider from "@/lib/global-provide";


export default function RootLayout() {
  const [FontsLoaded] = useFonts({
    "Rubik": "Rubik",
    "Rubik-Bold": require('../assets/fonts/Rubik-Bold.ttf'),
    "Rubik-Regular": require('../assets/fonts/Rubik-Regular.ttf'),
    "Rubik-Medium": require('../assets/fonts/Rubik-Medium.ttf'),
    "Rubik-SemiBold": require('../assets/fonts/Rubik-SemiBold.ttf'),
    "Rubik-ExtraBold": require('../assets/fonts/Rubik-ExtraBold.ttf'),

  })

  useEffect(() => {
    if (FontsLoaded) {
      SplashScreen.hide();
    }
  }, []);

  return (
      <GlobalProvider>
           <Stack screenOptions={{ headerShown: false }}/>
      </GlobalProvider>
  );
}
