import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Modal,
} from 'react-native'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Calendar } from 'react-native-calendars'
import { auth } from '../config/firebase'
import { salvarNotificacao } from '../services/notificacoes'

const colors = {
    background: '#edfbff',
    surface: '#FFFFFF',
    primary: '#4ca5f8',
    primaryDark: '#1e2353',
    title: '#252b4a',
    text: '#806F65',
    border: '#d0ecf0',
}

const servicos = [
    {
        id: 'banho',
        icone: 'water-outline',
        titulo: 'Agende seu banho',
        descricao: 'Deixe seu pet limpinho e cheiroso!',
    },
    {
        id: 'tosa',
        icone: 'cut-outline',
        titulo: 'Agende sua tosa',
        descricao: 'Um visual novo para seu melhor amigo!',
    },
    {
        id: 'consulta',
        icone: 'medkit-outline',
        titulo: 'Agende sua consulta',
        descricao: 'Cuide da saúde do seu pet.',
    },
    {
        id: 'produtos',
        icone: 'bag-handle-outline',
        titulo: 'Compre nossos produtos',
        descricao: 'Tudo que seu pet precisa em um só lugar.',
    },
]

const horarios = ['10:00', '13:00', '15:00', '17:00']

function obterDataLocal() {
    const data = new Date()

    return [
        data.getFullYear(),
        String(data.getMonth() + 1).padStart(2, '0'),
        String(data.getDate()).padStart(2, '0'),
    ].join('-')
}

export default function Home({ navigation }) {
    const [carregando, setCarregando] = useState(false)
    const [servicoSelecionado, setServicoSelecionado] = useState(null)
    const [modalAgendamento, setModalAgendamento] = useState(false)
    const [dataSelecionada, setDataSelecionada] = useState(null)
    const [horarioSelecionado, setHorarioSelecionado] = useState(null)

    const email = auth.currentUser?.email
    const nome = email?.split('@')[0] || 'amigo(a)'
    const hoje = obterDataLocal()

    function selecionarServico(servico) {
        if (carregando) return

        if (servico.id === 'produtos') {
            navigation.navigate('Produtos')
            return
        }

        setServicoSelecionado(servico)
        setDataSelecionada(null)
        setHorarioSelecionado(null)
        setModalAgendamento(true)
    }

    function horarioDisponivel(horario) {
        if (dataSelecionada !== hoje) {
            return true
        }

        const agora = new Date()
        const [hora, minuto] = horario.split(':').map(Number)

        const escolhido = new Date()
        escolhido.setHours(hora, minuto, 0, 0)

        return escolhido > agora
    }

    async function confirmarAgendamento() {
        if (!dataSelecionada || !horarioSelecionado) {
            Alert.alert(
                'Agendamento',
                'Escolha uma data e um horário.'
            )
            return
        }

        setCarregando(true)

        try {
            const dados = {
                banho: {
                    title: '🛁 Banho agendado!',
                    body: `Seu banho foi agendado para ${dataSelecionada} às ${horarioSelecionado}.`,
                },
                tosa: {
                    title: '✂️ Tosa agendada!',
                    body: `Sua tosa foi agendada para ${dataSelecionada} às ${horarioSelecionado}.`,
                },
                consulta: {
                    title: '🩺 Consulta agendada!',
                    body: `Sua consulta foi agendada para ${dataSelecionada} às ${horarioSelecionado}.`,
                },
            }

            const notificacao = dados[servicoSelecionado.id]

            await salvarNotificacao({
                usuarioId: auth.currentUser?.uid,
                title: notificacao.title,
                body: notificacao.body,
                tipo: servicoSelecionado.id,
            })

            setModalAgendamento(false)

            Alert.alert(
                'Tudo certo! 🐾',
                `${servicoSelecionado.titulo} foi agendado para ${dataSelecionada} às ${horarioSelecionado}.`
            )
        } catch (error) {
            console.log('Erro:', error)

            Alert.alert(
                'Ops! 🐾',
                'Não foi possível realizar o agendamento. Tente novamente.'
            )
        } finally {
            setCarregando(false)
        }
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <View>
                    <Text style={styles.hello}>
                        Olá, {nome}! 🐾
                    </Text>

                    <Text style={styles.subtitle}>
                        O que seu pet precisa hoje?
                    </Text>
                </View>

                <View style={styles.paw}>
                    <Ionicons
                        name="paw-outline"
                        size={28}
                        color={colors.primary}
                    />
                </View>
            </View>

            <View style={styles.banner}>
                <View style={styles.bannerText}>
                    <Text style={styles.bannerTitle}>
                        Tudo para o seu melhor amigo{' '}
                        <Ionicons
                            name="heart"
                            size={18}
                            color="#FFFFFF"
                        />
                    </Text>

                    <Text style={styles.bannerDescription}>
                        Cuide, mime e mantenha seu pet sempre feliz.
                    </Text>
                </View>

                <Ionicons
                    name="paw-outline"
                    size={65}
                    color="#FFFFFF"
                />
            </View>

            <Text style={styles.sectionTitle}>
                Nossos serviços
            </Text>

            <View style={styles.grid}>
                {servicos.map((servico) => (
                    <TouchableOpacity
                        key={servico.id}
                        style={styles.serviceCard}
                        onPress={() => selecionarServico(servico)}
                        activeOpacity={0.8}
                        disabled={carregando}
                    >
                        <View style={styles.serviceIcon}>
                            <Ionicons
                                name={servico.icone}
                                size={27}
                                color={colors.primary}
                            />
                        </View>

                        <Text style={styles.serviceTitle}>
                            {servico.titulo}
                        </Text>

                        <Text style={styles.serviceDescription}>
                            {servico.descricao}
                        </Text>

                        <View style={styles.action}>
                            <Text style={styles.actionText}>
                                {servico.id === 'produtos'
                                    ? 'Ver produtos'
                                    : 'Agendar'}
                            </Text>

                            <Ionicons
                                name="arrow-forward"
                                size={20}
                                color={colors.primary}
                            />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.infoCard}>
                <Ionicons
                    name="heart-outline"
                    size={30}
                    color={colors.primary}
                    style={styles.infoIcon}
                />

                <View style={styles.infoContent}>
                    <Text style={styles.infoTitle}>
                        PetCare
                    </Text>

                    <Text style={styles.infoText}>
                        Cuidar do seu pet é nossa maior alegria!
                    </Text>
                </View>
            </View>

            <Modal
                visible={modalAgendamento}
                transparent
                animationType="slide"
                onRequestClose={() => setModalAgendamento(false)}
            >
                <View style={styles.modalFundo}>
                    <View style={styles.modalCaixa}>
                        <Text style={styles.modalTitulo}>
                            Agendar {servicoSelecionado?.titulo}
                        </Text>

                        <Text style={styles.modalLabel}>
                            Escolha a data
                        </Text>

                        <Calendar
                            minDate={hoje}
                            onDayPress={(day) => {
                                setDataSelecionada(day.dateString)
                                setHorarioSelecionado(null)
                            }}
                            markedDates={
                                dataSelecionada
                                    ? {
                                        [dataSelecionada]: {
                                            selected: true,
                                            selectedColor: colors.primary,
                                        },
                                    }
                                    : {}
                            }
                            theme={{
                                todayTextColor: colors.primary,
                                arrowColor: colors.primary,
                                selectedDayBackgroundColor: colors.primary,
                                textDayFontWeight: '600',
                                textMonthFontWeight: '800',
                                textDayHeaderFontWeight: '700',
                            }}
                        />

                        {dataSelecionada && (
                            <Text style={styles.dataEscolhida}>
                                Data escolhida:{' '}
                                {new Date(
                                    dataSelecionada + 'T12:00:00'
                                ).toLocaleDateString('pt-BR')}
                            </Text>
                        )}

                        <Text style={styles.modalLabel}>
                            Escolha o horário
                        </Text>

                        <View style={styles.opcoes}>
                            {horarios.map((horario) => {
                                const disponivel =
                                    horarioDisponivel(horario)

                                return (
                                    <TouchableOpacity
                                        key={horario}
                                        style={[
                                            styles.opcao,
                                            horarioSelecionado === horario &&
                                                styles.opcaoSelecionada,
                                            !disponivel &&
                                                styles.opcaoIndisponivel,
                                        ]}
                                        onPress={() => {
                                            if (disponivel) {
                                                setHorarioSelecionado(horario)
                                            }
                                        }}
                                        disabled={!disponivel}
                                    >
                                        <Text
                                            style={[
                                                styles.opcaoTexto,
                                                horarioSelecionado === horario &&
                                                    styles.opcaoTextoSelecionada,
                                                !disponivel &&
                                                    styles.opcaoTextoIndisponivel,
                                            ]}
                                        >
                                            {horario}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>

                        <TouchableOpacity
                            style={styles.botaoConfirmar}
                            onPress={confirmarAgendamento}
                            disabled={carregando}
                        >
                            <Text style={styles.botaoConfirmarTexto}>
                                {carregando
                                    ? 'Agendando...'
                                    : 'Confirmar agendamento'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.botaoCancelar}
                            onPress={() => setModalAgendamento(false)}
                        >
                            <Text style={styles.botaoCancelarTexto}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: 55,
        paddingBottom: 30,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 22,
    },

    hello: {
        fontSize: 27,
        fontWeight: '800',
        color: colors.title,
        marginBottom: 5,
    },

    subtitle: {
        fontSize: 14,
        color: colors.text,
    },

    paw: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.08,
        shadowRadius: 7,
        elevation: 3,
    },

    banner: {
        backgroundColor: colors.primary,
        borderRadius: 24,
        padding: 22,
        minHeight: 145,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 28,

        shadowColor: colors.primary,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.22,
        shadowRadius: 8,
        elevation: 4,
    },

    bannerText: {
        flex: 1,
        paddingRight: 10,
    },

    bannerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
        lineHeight: 26,
    },

    bannerDescription: {
        fontSize: 13,
        color: '#FFFFFF',
        opacity: 0.9,
        lineHeight: 19,
        marginTop: 8,
    },

    sectionTitle: {
        fontSize: 21,
        fontWeight: '800',
        color: colors.title,
        marginBottom: 15,
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    serviceCard: {
        width: '48%',
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 16,
        marginBottom: 15,
        minHeight: 220,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },

    serviceIcon: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: '#edfbff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 13,
    },

    serviceTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.title,
        lineHeight: 21,
        marginBottom: 6,
    },

    serviceDescription: {
        fontSize: 12,
        color: colors.text,
        lineHeight: 17,
        flex: 1,
    },

    action: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 13,
    },

    actionText: {
        color: colors.primaryDark,
        fontSize: 12,
        fontWeight: '800',
    },

    infoCard: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        borderWidth: 1,
        borderColor: colors.border,
    },

    infoIcon: {
        marginRight: 13,
    },

    infoContent: {
        flex: 1,
    },

    infoTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: colors.title,
        marginBottom: 3,
    },

    infoText: {
        fontSize: 13,
        color: colors.text,
    },

    modalFundo: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        justifyContent: 'flex-end',
    },

    modalCaixa: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 20,
        paddingBottom: 30,
        maxHeight: '90%',
    },

    modalTitulo: {
        fontSize: 21,
        fontWeight: '800',
        color: colors.title,
        marginBottom: 18,
        textAlign: 'center',
    },

    modalLabel: {
        fontSize: 15,
        fontWeight: '800',
        color: colors.title,
        marginTop: 12,
        marginBottom: 8,
    },

    dataEscolhida: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.primaryDark,
        textAlign: 'center',
        marginTop: 8,
    },

    opcoes: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    opcao: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: colors.surface,
    },

    opcaoSelecionada: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },

    opcaoIndisponivel: {
        backgroundColor: '#eeeeee',
        borderColor: '#dddddd',
    },

    opcaoTexto: {
        color: colors.title,
        fontSize: 13,
        fontWeight: '700',
    },

    opcaoTextoSelecionada: {
        color: '#FFFFFF',
    },

    opcaoTextoIndisponivel: {
        color: '#aaaaaa',
    },

    botaoConfirmar: {
        backgroundColor: colors.primary,
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 20,
    },

    botaoConfirmarTexto: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '800',
    },

    botaoCancelar: {
        alignItems: 'center',
        paddingVertical: 12,
        marginTop: 4,
    },

    botaoCancelarTexto: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '700',
    },
})