import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, Image, ActivityIndicator, } 
from 'react-native'
import { useRef, useState } from 'react'
import { entrar } from '../services/auth'

const colors = {
    background: '#edfbff',
    surface: '#FFFFFF',
    primary: '#4ca5f8',
    primaryDark: '#1e2353',
    title: '#252b4a',
    label: '#383a5b',
    text: '#806F65',
    textLight: '#8A7B72',
    placeholder: '#A89F98',
    inputBg: '#fafcf2',
    inputBorder: '#d0ecf0',
}

const radius = {
    input: 14,
    button: 14,
    card: 24,
}

const MENSAGENS_ERRO = {
    'auth/invalid-email': 'O e-mail informado é inválido.',
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/user-not-found': 'E-mail ou senha incorretos.',
    'auth/wrong-password': 'E-mail ou senha incorretos.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco e tente de novo.',
    'auth/network-request-failed': 'Sem conexão. Verifique sua internet.',
}

export default function Login({ navigation }) {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [carregando, setCarregando] = useState(false)

    const senhaRef = useRef(null)

    function validar() {
        if (!email.trim() || !senha) {
            return 'Preencha todos os campos.'
        }
        if (!/\S+@\S+\.\S+/.test(email.trim())) {
            return 'Digite um e-mail válido.'
        }
        return null
    }

    async function realizarLogin() {
        if (carregando) return

        const erroValidacao = validar()
        if (erroValidacao) {
            Alert.alert('Atenção 🐾', erroValidacao)
            return
        }

        setCarregando(true)

        try {
            await entrar(email.trim(), senha)
            navigation.replace('Principal')
        } catch (error) {
            Alert.alert(
                'Ops! 🐾',
                MENSAGENS_ERRO[error?.code] ??
                    'Não foi possível entrar. Tente novamente.'
            )

            if (__DEV__) console.log(error)
        } finally {
            setCarregando(false)
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <View>
                        <Image
                            source={require('../assets/Logo_PetShop.png')}
                            style={styles.logo}
                            resizeMode="contain"
                            accessibilityLabel="Logo do PetCare"
                        />
                    </View>

                    <Text style={styles.title}>Entre na sua conta</Text>

                </View>

                <View style={styles.card}>

                    <Text style={styles.label}>E-mail</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Digite seu e-mail"
                        placeholderTextColor={colors.placeholder}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="next"
                        onSubmitEditing={() => senhaRef.current?.focus()}
                        accessibilityLabel="E-mail"
                    />

                    <Text style={styles.label}>Senha</Text>

                    <View style={styles.passwordWrapper}>
                        <TextInput
                            ref={senhaRef}
                            style={[styles.input, styles.passwordInput]}
                            placeholder="Digite sua senha"
                            placeholderTextColor={colors.placeholder}
                            value={senha}
                            onChangeText={setSenha}
                            secureTextEntry={!mostrarSenha}
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="done"
                            onSubmitEditing={realizarLogin}
                            accessibilityLabel="Senha"
                        />

                        <TouchableOpacity
                            style={styles.toggleButton}
                            onPress={() => setMostrarSenha((v) => !v)}
                            accessibilityRole="button"
                            accessibilityLabel={
                                mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'
                            }
                        >
                            <Text style={styles.toggleText}>
                                {mostrarSenha ? 'Ocultar' : 'Mostrar'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, carregando && styles.buttonDisabled]}
                        onPress={realizarLogin}
                        activeOpacity={0.8}
                        disabled={carregando}
                        accessibilityRole="button"
                        accessibilityLabel="Acessar"
                    >
                        {carregando ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.buttonText}>Acessar</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cadastroButton}
                        onPress={() => navigation.navigate('Cadastro')}
                        activeOpacity={0.7}
                        disabled={carregando}
                    >
                        <Text style={styles.cadastroText}>Criar conta</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
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

    logo: {
        width: 130,
        height: 130,
    },

    title: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.title,
        marginBottom: 6,
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

    welcome: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.title,
        marginBottom: 8,
    },

    description: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.textLight,
        marginBottom: 22,
    },

    label: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.label,
        marginBottom: 7,
    },

    input: {
        height: 52,
        backgroundColor: colors.inputBg,
        borderWidth: 1,
        borderColor: colors.inputBorder,
        borderRadius: radius.input,
        paddingHorizontal: 16,
        fontSize: 15,
        color: colors.title,
        marginBottom: 16,
    },

    passwordWrapper: {
        justifyContent: 'center',
    },

    passwordInput: {
        paddingRight: 84,
    },

    toggleButton: {
        position: 'absolute',
        right: 4,
        top: 0,
        height: 52,
        paddingHorizontal: 12,
        justifyContent: 'center',
    },

    toggleText: {
        color: colors.primaryDark,
        fontSize: 13,
        fontWeight: '700',
    },

    button: {
        height: 54,
        backgroundColor: colors.primary,
        borderRadius: radius.button,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 6,

        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 3,
    },

    buttonDisabled: {
        opacity: 0.7,
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },

    cadastroButton: {
        alignItems: 'center',
        marginTop: 18,
        paddingVertical: 8,
    },

    cadastroText: {
        color: colors.primaryDark,
        fontSize: 14,
        fontWeight: '700',
    },
})