import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListVideos from './screens/ListVideos';
import ViewVideo from './screens/ViewVideo';

const Stack = createNativeStackNavigator();

export default function App({navigation}) {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="List Videos" component={ListVideos} options={{title: "Videos"}}/>
        <Stack.Screen name="View Videos" component={ViewVideo} options={({ route }) => ({ title: route.params.title })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


