import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, Image, ActivityIndicator, } 
from 'react-native'
import { useRef, useState } from 'react'
import { cadastrar } from '../services/auth'

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
    'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
    'auth/invalid-email': 'O e-mail informado é inválido.',
    'auth/weak-password': 'A senha é muito fraca. Use ao menos 6 caracteres.',
    'auth/network-request-failed': 'Sem conexão. Verifique sua internet.',
}

export default function Cadastro({ navigation }) {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [carregando, setCarregando] = useState(false)

    const emailRef = useRef(null)
    const senhaRef = useRef(null)
    const confirmarRef = useRef(null)

    function validar() {
        if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
            return 'Preencha todos os campos.'
        }
        if (!/\S+@\S+\.\S+/.test(email.trim())) {
            return 'Digite um e-mail válido.'
        }
        if (senha.length < 6) {
            return 'A senha deve ter ao menos 6 caracteres.'
        }
        if (senha !== confirmarSenha) {
            return 'As senhas não conferem.'
        }
        return null
    }

    async function realizarCadastro() {
        if (carregando) return

        const erroValidacao = validar()
        if (erroValidacao) {
            Alert.alert('Atenção', erroValidacao)
            return
        }

        setCarregando(true)

        try {
    
            await cadastrar(email.trim(), senha, nome.trim())

            Alert.alert(
                'Cadastro realizado!',
                'Sua conta foi criada com sucesso.',
                [
                    {
                        text: 'Continuar',
                        onPress: () => navigation.replace('Principal'),
                    },
                ]
            )
        } catch (error) {
            Alert.alert(
                'Ops! 🐾',
                MENSAGENS_ERRO[error?.code] ??
                    'Não foi possível criar sua conta. Tente novamente.'
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

                    <Text style={styles.title}>Crie sua conta</Text>

                    <Text style={styles.subtitle}>
                        Cuide do seu pet com todo carinho
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.welcome}>Bem-vindo ao PetCare! </Text>

                    <Text style={styles.description}>
                        Cadastre-se para encontrar produtos, serviços e tudo
                        que seu melhor amigo precisa.
                    </Text>

                    <Text style={styles.label}>Nome</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Como podemos te chamar?"
                        placeholderTextColor={colors.placeholder}
                        value={nome}
                        onChangeText={setNome}
                        autoCapitalize="words"
                        returnKeyType="next"
                        onSubmitEditing={() => emailRef.current?.focus()}
                        accessibilityLabel="Nome"
                    />

                    <Text style={styles.label}>E-mail</Text>

                    <TextInput
                        ref={emailRef}
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
                            placeholder="Mínimo de 6 caracteres"
                            placeholderTextColor={colors.placeholder}
                            value={senha}
                            onChangeText={setSenha}
                            secureTextEntry={!mostrarSenha}
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="next"
                            onSubmitEditing={() => confirmarRef.current?.focus()}
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

                    <Text style={styles.label}>Confirmar senha</Text>

                    <TextInput
                        ref={confirmarRef}
                        style={styles.input}
                        placeholder="Repita sua senha"
                        placeholderTextColor={colors.placeholder}
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                        secureTextEntry={!mostrarSenha}
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="done"
                        onSubmitEditing={realizarCadastro}
                        accessibilityLabel="Confirmar senha"
                    />

                    <TouchableOpacity
                        style={[styles.button, carregando && styles.buttonDisabled]}
                        onPress={realizarCadastro}
                        activeOpacity={0.8}
                        disabled={carregando}
                        accessibilityRole="button"
                        accessibilityLabel="Criar minha conta"
                    >
                        {carregando ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : 
                        (
                            <Text style={styles.buttonText}>
                                Criar minha conta
                            </Text>
                        )}

                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => navigation.navigate('Login')}
                        activeOpacity={0.7}
                        disabled={carregando}
                    >
                        <Text style={styles.loginText}>Já tenho uma conta</Text>

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
        fontSize: 19,
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
        marginBottom: 16,
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

    buttonPaw: {
        fontSize: 20,
        marginLeft: 10,
    },

    loginButton: {
        alignItems: 'center',
        marginTop: 18,
        paddingVertical: 8,
    },

    loginText: {
        color: colors.primaryDark,
        fontSize: 14,
        fontWeight: '700',
    },
})
