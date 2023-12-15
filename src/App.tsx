
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GestureRecording from './screens/RecordingScreen';
import HistoryScreen from './screens/HistoryScreen';
import { HistoryContextProvider } from "./common/HistoryContext.ts";
import { useState } from "react";


const Stack = createNativeStackNavigator();

function App() {
  const [history,setHistory] = useState([])
  return (
    <NavigationContainer>
      <HistoryContextProvider value={{ history, setHistory }}  >
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
          }}
          initialRouteName="Recording"
        >
          <Stack.Screen name="Recording" component={GestureRecording} />
          <Stack.Screen name="History" component={HistoryScreen} />
        </Stack.Navigator>
      </HistoryContextProvider>

    </NavigationContainer>
  );
}

export default App;
