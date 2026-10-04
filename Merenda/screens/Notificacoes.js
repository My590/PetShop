import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from 'react-native'
import { useCallback, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { auth } from '../config/firebase'
import { useFocusEffect } from '@react-navigation/native'
import {
    obterNotificacoes,
    marcarComoLida,
    marcarTodasComoLidas,
} from '../services/notificacoes'

const colors = {
    background: '#edfbff',
    surface: '#FFFFFF',
    primary: '#4ca5f8',
    primaryDark: '#1e2353',
    title: '#252b4a',
    text: '#806F65',
    textLight: '#8A7B72',
    border: '#d0ecf0',
    unread: '#eaf5ff',
}

function formatarData(data) {
    if (!data) return ''

    const valor = new Date(data)

    return valor.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export default function Notificacoes() {
    const [notificacoes, setNotificacoes] = useState([])

    const carregarNotificacoes = useCallback(async () => {
        const dados = await obterNotificacoes(
            auth.currentUser?.uid
        )

        setNotificacoes(dados)
    }, [])

    useFocusEffect(
        useCallback(() => {
            carregarNotificacoes()
        }, [carregarNotificacoes])
    )

    async function lerNotificacao(id) {
        const atualizadas = await marcarComoLida(
            id,
            auth.currentUser?.uid
        )

        setNotificacoes(atualizadas)
    }

    async function lerTodas() {
        const atualizadas = await marcarTodasComoLidas(
            auth.currentUser?.uid
        )

        setNotificacoes(atualizadas)
    }

    function renderItem({ item }) {
        const icones = {
            banho: 'water-outline',
            tosa: 'cut-outline',
            consulta: 'medkit-outline',
            geral: 'notifications-outline',
        }

        return (
            <TouchableOpacity
                style={[
                    styles.card,
                    !item.lida && styles.cardNaoLido,
                ]}
                onPress={() => lerNotificacao(item.id)}
                activeOpacity={0.8}
            >
                <View style={styles.icone}>
                    <Ionicons
                        name={
                            icones[item.tipo] ||
                            'notifications-outline'
                        }
                        size={23}
                        color={colors.primary}
                    />
                </View>

                <View style={styles.conteudo}>
                    <Text style={styles.titulo}>
                        {item.title}
                    </Text>

                    <Text style={styles.mensagem}>
                        {item.body}
                    </Text>

                    <Text style={styles.data}>
                        {formatarData(item.data)}
                    </Text>
                </View>

                {!item.lida && <View style={styles.ponto} />}
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <View style={styles.tituloLinha}>
                        <Ionicons
                            name="notifications-outline"
                            size={27}
                            color={colors.primary}
                        />

                        <Text style={styles.tituloTela}>
                            Notificações
                        </Text>
                    </View>

                    <Text style={styles.subtitulo}>
                        Fique por dentro das novidades do PetCare
                    </Text>
                </View>

                {notificacoes.some((item) => !item.lida) && (
                    <TouchableOpacity onPress={lerTodas}>
                        <Text style={styles.lerTodas}>
                            Ler todas
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={notificacoes}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={
                    notificacoes.length === 0
                        ? styles.listaVazia
                        : styles.lista
                }
                ListEmptyComponent={
                    <View style={styles.vazio}>
                        <Ionicons
                            name="notifications-outline"
                            size={55}
                            color={colors.primary}
                        />

                        <Text style={styles.tituloVazio}>
                            Nenhuma notificação
                        </Text>

                        <Text style={styles.textoVazio}>
                            Quando você receber novidades,
                            elas aparecerão aqui.
                        </Text>
                    </View>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 20,
        paddingTop: 55,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 22,
    },

    tituloLinha: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    tituloTela: {
        fontSize: 27,
        fontWeight: '800',
        color: colors.title,
    },

    subtitulo: {
        fontSize: 13,
        color: colors.text,
        marginTop: 5,
    },

    lerTodas: {
        color: colors.primaryDark,
        fontSize: 13,
        fontWeight: '700',
    },

    lista: {
        paddingBottom: 30,
    },

    listaVazia: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },

    cardNaoLido: {
        backgroundColor: colors.unread,
        borderWidth: 1,
        borderColor: colors.border,
    },

    icone: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#edfbff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 13,
    },

    conteudo: {
        flex: 1,
    },

    titulo: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.title,
        marginBottom: 4,
    },

    mensagem: {
        fontSize: 13,
        lineHeight: 19,
        color: colors.text,
    },

    data: {
        fontSize: 11,
        color: colors.textLight,
        marginTop: 6,
    },

    ponto: {
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: colors.primary,
        marginLeft: 8,
    },

    vazio: {
        alignItems: 'center',
        paddingHorizontal: 30,
    },

    tituloVazio: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.title,
        marginTop: 15,
        marginBottom: 8,
    },

    textoVazio: {
        fontSize: 14,
        lineHeight: 21,
        color: colors.text,
        textAlign: 'center',
    },
})