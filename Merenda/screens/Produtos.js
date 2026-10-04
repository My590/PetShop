import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const produtos = [
    {
        id: '1',
        nome: 'Ração para cães',
        descricao: 'Alimentação completa para seu pet.',
        preco: 'R$ 49,90',
        icone: 'paw-outline',
    },
    {
        id: '2',
        nome: 'Ração para gatos',
        descricao: 'Alimentação equilibrada para gatos.',
        preco: 'R$ 44,90',
        icone: 'paw-outline',
    },
    {
        id: '3',
        nome: 'Brinquedo para pets',
        descricao: 'Diversão e entretenimento para seu pet.',
        preco: 'R$ 29,90',
        icone: 'baseball-outline',
    },
    {
        id: '4',
        nome: 'Shampoo para pets',
        descricao: 'Cuidados especiais para a higiene.',
        preco: 'R$ 24,90',
        icone: 'water-outline',
    },
]

export default function Produtos({ navigation }) {
    function comprar() {
        Alert.alert(
            'Produto indisponível',
            'Este produto ainda não está disponível para compra no momento.'
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={produtos}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.lista}
                ListHeaderComponent={
                    <View>
                        <TouchableOpacity
                            style={styles.voltarContainer}
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="chevron-back"
                                size={20}
                                color="#4CA5F8"
                            />

                            <Text style={styles.voltar}>
                                Voltar
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.cabecalho}>
                            <View style={styles.iconeCabecalho}>
                                <Ionicons
                                    name="bag-handle-outline"
                                    size={28}
                                    color="#4CA5F8"
                                />
                            </View>

                            <View style={styles.tituloArea}>
                                <Text style={styles.titulo}>
                                    Nossos produtos
                                </Text>
                            </View>
                        </View>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.topoCard}>
                            <View style={styles.iconeProduto}>
                                <Ionicons
                                    name={item.icone}
                                    size={30}
                                    color="#4CA5F8"
                                />
                            </View>

                            <View style={styles.info}>
                                <Text style={styles.nome}>
                                    {item.nome}
                                </Text>

                                <Text style={styles.descricao}>
                                    {item.descricao}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.divisor} />

                        <View style={styles.rodapeCard}>
                            <View>
                                <Text style={styles.precoLabel}>
                                    A partir de
                                </Text>

                                <Text style={styles.preco}>
                                    {item.preco}
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.botao}
                                onPress={comprar}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.botaoTexto}>
                                    Indisponível
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7FBFF',
    },

    lista: {
        paddingTop: 48,
        paddingHorizontal: 20,
        paddingBottom: 30,
    },

    voltarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginBottom: 24,
        paddingVertical: 4,
    },

    voltar: {
        fontSize: 15,
        fontWeight: '700',
        color: '#4CA5F8',
        marginLeft: 5,
    },

    cabecalho: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },

    iconeCabecalho: {
        width: 58,
        height: 58,
        borderRadius: 18,
        backgroundColor: '#E5F3FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },

    tituloArea: {
        flex: 1,
    },

    titulo: {
        fontSize: 26,
        fontWeight: '900',
        color: '#17324D',
        marginBottom: 5,
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 17,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E1F0FA',

        shadowColor: '#6BA9D6',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
    },

    topoCard: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    iconeProduto: {
        width: 64,
        height: 64,
        borderRadius: 18,
        backgroundColor: '#F0F8FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },

    info: {
        flex: 1,
    },

    nome: {
        fontSize: 17,
        fontWeight: '800',
        color: '#17324D',
        marginBottom: 5,
    },

    descricao: {
        fontSize: 13,
        lineHeight: 18,
        color: '#7A8996',
    },

    divisor: {
        height: 1,
        backgroundColor: '#EEF4F8',
        marginVertical: 15,
    },

    rodapeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    precoLabel: {
        fontSize: 11,
        color: '#91A0AC',
        marginBottom: 2,
    },

    preco: {
        fontSize: 18,
        fontWeight: '900',
        color: '#4CA5F8',
    },

    botao: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CA5F8',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 15,
        minWidth: 112,
    },

    botaoTexto: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '800',
    },
})