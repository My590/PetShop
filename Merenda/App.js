import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigation } from '@react-navigation/native-stack';

import Login from './screens/Login'
import Cadastro from './screens/Cadastro'
import Home from './screens/Home'

const Stack = createNativeStackNavigation()

export default function App() {
  return (
    <NavigationContainer>
      
      <Stack.Navigator>

        <Stack.Screen
        name = 'Login'
        component = {Login}
        />

        <Stack.Screen
          name = 'Cadastro'
          component = {Cadastro}
        />

        <Stack.Screen
          name = 'Home'
          component = {Home}
        />

      </Stack.Navigator>

    </NavigationContainer>
  )
}