import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator, } 
from 'react-native'
import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'

const colors = {
    background: '#edfbff',
    surface: '#FFFFFF',
    primary: '#4ca5f8',
    primaryDark: '#1e2353',
    title: '#252b4a',
    label: '#383a5b',
    text: '#806F65',
    textLight: '#8A7B72',
    inputBorder: '#d0ecf0',
    danger: '#d64545',
    dangerBg: '#fdeeee',
}

const radius = {
    button: 14,
    card: 24,
}

function formatarData(valor) {
    if (!valor) return '—'
    const data = new Date(valor)
    if (isNaN(data.getTime())) return '—'
    return data.toLocaleDateString('pt-BR')
}

export default function Perfil({ navigation }) {
    const [usuario, setUsuario] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const [saindo, setSaindo] = useState(false)

    useEffect(() => {
        const auth = getAuth()
        const cancelar = onAuthStateChanged(auth, (user) => {
            setUsuario(user)
            setCarregando(false)
        })
        return cancelar
    }, [])

    const nome =
        usuario?.displayName?.trim() ||
        usuario?.email?.split('@')[0] ||
        'Usuário'

    const inicial = nome.charAt(0).toUpperCase()

    function confirmarLogout() {
        Alert.alert('Sair da conta', 'Tem certeza de que deseja sair?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Sair', style: 'destructive', onPress: realizarLogout },
        ])
    }

    async function realizarLogout() {
        if (saindo) return
        setSaindo(true)

        try {
            await signOut(getAuth())
            navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Login' }] })
        } catch (error) {
            Alert.alert('Ops! 🐾', 'Não foi possível sair. Tente novamente.')
            if (__DEV__) console.log(error)
            setSaindo(false)
        }
    }

    if (carregando) {
        return (
            <View style={[styles.container, styles.centro]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{inicial}</Text>
                    </View>

                    <Text style={styles.title}>{nome}</Text>

                    <Text style={styles.subtitle}>{usuario?.email}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Dados da conta</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Nome</Text>
                        <Text style={styles.value}>{nome}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>E-mail</Text>
                        <Text style={styles.value}>{usuario?.email ?? '—'}</Text>
                    </View>

                    <View style={[styles.row, styles.rowLast]}>
                        <Text style={styles.label}>Conta criada em</Text>
                        <Text style={styles.value}>
                            {formatarData(usuario?.metadata?.creationTime)}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.logoutButton, saindo && styles.buttonDisabled]}
                    onPress={confirmarLogout}
                    activeOpacity={0.8}
                    disabled={saindo}
                    accessibilityRole="button"
                    accessibilityLabel="Sair da conta"
                >
                    {saindo ? (
                        <ActivityIndicator color={colors.danger} />
                    ) : (
                        <Text style={styles.logoutText}>Sair da conta</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    centro: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 30,
    },

    header: {
        alignItems: 'center',
        marginBottom: 24,
    },

    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,

        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,
    },

    avatarText: {
        fontSize: 40,
        fontWeight: '800',
        color: '#FFFFFF',
    },

    title: {
        fontSize: 26,
        fontWeight: '800',
        color: colors.title,
        marginBottom: 4,
        textAlign: 'center',
    },

    subtitle: {
        fontSize: 15,
        color: colors.text,
        textAlign: 'center',
    },

    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.card,
        padding: 24,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },

    cardTitle: {
        fontSize: 19,
        fontWeight: '700',
        color: colors.title,
        marginBottom: 12,
    },

    row: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.inputBorder,
    },

    rowLast: {
        borderBottomWidth: 0,
        paddingBottom: 0,
    },

    label: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.label,
        marginBottom: 4,
    },

    value: {
        fontSize: 16,
        color: colors.title,
    },

    logoutButton: {
        height: 54,
        backgroundColor: colors.dangerBg,
        borderRadius: radius.button,
        borderWidth: 1,
        borderColor: colors.danger,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },

    buttonDisabled: {
        opacity: 0.7,
    },

    logoutText: {
        color: colors.danger,
        fontSize: 16,
        fontWeight: '800',
    },
})