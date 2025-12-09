import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import LogInScreen from "./src/screens/LogInScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <LogInScreen />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

