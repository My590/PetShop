import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'

import Login from './screens/Login'
import Cadastro from './screens/Cadastro'
import Home from './screens/Home'
import Perfil from './screens/Perfil'

const colors = {
    primary: '#4ca5f8',
    inactive: '#A89F98',
    surface: '#FFFFFF',
    border: '#d0ecf0',
}

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

// Ícones de cada aba: [ativo, inativo]
const ICONES = {
    Home: ['home', 'home-outline'],
    Notificações: ['notifications', 'notifications-outline'],
    Perfil: ['person', 'person-outline'],
}

// Barra de navegação inferior (aparece depois do login)
function Abas() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.inactive,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '700',
                },
                tabBarIcon: ({ focused, color, size }) => {
                    const [ativo, inativo] = ICONES[route.name]
                    return (
                        <Ionicons
                            name={focused ? ativo : inativo}
                            size={size}
                            color={color}
                        />
                    )
                },
            })}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Perfil" component={Perfil} />
        </Tab.Navigator>
    )
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Cadastro"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="Cadastro" component={Cadastro} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Principal" component={Abas} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}