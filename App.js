import { useEffect, useState } from 'react'
import {
    NavigationContainer,
} from '@react-navigation/native'
import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack'
import {
    createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import {
    Ionicons,
    MaterialCommunityIcons,
} from '@expo/vector-icons'
import {
    StyleSheet,
    Text,
    View,
} from 'react-native'

import Login from './screens/Login'
import Cadastro from './screens/Cadastro'
import Home from './screens/Home'
import Perfil from './screens/Perfil'
import Notificacoes from './screens/Notificacoes'

const colors = {
    primary: '#4ca5f8',
    inactive: '#A89F98',
    surface: '#FFFFFF',
    border: '#d0ecf0',
    background: '#edfbff',
    text: '#243746',
}

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const ICONES = {
    Home: ['home', 'home-outline'],
    Notificações: ['notifications', 'notifications-outline'],
    Perfil: ['person', 'person-outline'],
}

function Splash() {
    return (
        <View style={styles.splash}>
            <View style={styles.logoContainer}>
                <MaterialCommunityIcons
                    name="paw"
                    size={75}
                    color="#4ca5f8"
                />
            </View>

            <Text style={styles.logoNome}>
                PetCare
            </Text>

            <Text style={styles.splashDescricao}>
                Cuidando de quem faz parte da sua família.
            </Text>

            <Text style={styles.splashTexto}>
                Agende banhos, tosas e consultas
                {'\n'}
                e encontre produtos para o seu pet.
            </Text>

            <View style={styles.splashRodape}>
                <Ionicons
                    name="heart"
                    size={18}
                    color="#4ca5f8"
                />

                <Text style={styles.splashRodapeTexto}>
                    Todo cuidado merece carinho.
                </Text>
            </View>
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
                    const [ativo, inativo] =
                        ICONES[route.name]

                    return (
                        <Ionicons
                            name={
                                focused
                                    ? ativo
                                    : inativo
                            }
                            size={size}
                            color={color}
                        />
                    )
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={Home}
            />

            <Tab.Screen
                name="Notificações"
                component={Notificacoes}
            />

            <Tab.Screen
                name="Perfil"
                component={Perfil}
            />
        </Tab.Navigator>
    )
}

export default function App() {
    const [carregando, setCarregando] =
        useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setCarregando(false)
        }, 5000)

        return () => clearTimeout(timer)
    }, [])

    if (carregando) {
        return <Splash />
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Cadastro"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen
                    name="Cadastro"
                    component={Cadastro}
                />

                <Stack.Screen
                    name="Login"
                    component={Login}
                />

                <Stack.Screen
                    name="Principal"
                    component={Abas}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    splash: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 35,
    },

    logoContainer: {
        width: 125,
        height: 125,
        borderRadius: 63,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 22,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 5,
    },

    logoNome: {
        fontSize: 38,
        fontWeight: '800',
        color: colors.primary,
        marginBottom: 12,
    },

    splashDescricao: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        textAlign: 'center',
        lineHeight: 25,
        marginBottom: 12,
    },

    splashTexto: {
        fontSize: 14,
        color: '#647985',
        textAlign: 'center',
        lineHeight: 22,
    },

    splashRodape: {
        position: 'absolute',
        bottom: 55,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },

    splashRodapeTexto: {
        fontSize: 13,
        color: '#647985',
        fontWeight: '600',
    },
})