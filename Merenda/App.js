import { useEffect, useState } from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'

import Login from './screens/Login'
import Cadastro from './screens/Cadastro'
import Home from './screens/Home'
import Perfil from './screens/Perfil'
import Notificacoes from './screens/Notificacoes'
import Produtos from './screens/Produtos'
import { configurarNotificacoes } from './services/notificacoes'

const colors = {
    primary: '#4ca5f8',
    inactive: '#A89F98',
    surface: '#FFFFFF',
    border: '#d0ecf0',
}

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const ICONES = {
    Home: ['home', 'home-outline'],
    Notificacoes: ['notifications', 'notifications-outline'],
    Perfil: ['person', 'person-outline'],
}

function Splash() {
    return (
        <View style={styles.splash}>
            <Image
                source={require('./assets/Logo_PetShop.png')}
                style={styles.logo}
                resizeMode="contain"
            />
        </View>
    )
}

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
            <Tab.Screen name="Notificacoes" component={Notificacoes} />
            <Tab.Screen name="Perfil" component={Perfil} />
        </Tab.Navigator>
    )
}

export default function App() {
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        configurarNotificacoes()

        const timer = setTimeout(() => {
            setCarregando(false)
        }, 4000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Cadastro"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="Cadastro" component={Cadastro} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Principal" component={Abas} />
		<Stack.Screen name="Produtos" component={Produtos} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    splash: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },

    logo: {
        width: 260,
        height: 260,
    },
})




