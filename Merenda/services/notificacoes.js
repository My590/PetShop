import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = '@petcare_notificacoes'

export async function configurarNotificacoes() {
    console.log('Sistema de notificacoes internas configurado.')
}

export async function obterNotificacoes(usuarioId) {
    try {
        if (!usuarioId) return []

        const dados =
            await AsyncStorage.getItem(STORAGE_KEY)

        if (!dados) return []

        const todas = JSON.parse(dados)

        return todas.filter(
            (item) => item.usuarioId === usuarioId
        )
    } catch (error) {
        console.log(
            'Erro ao carregar notificacoes:',
            error
        )

        return []
    }
}

export async function salvarNotificacao(
    notificacao
) {
    try {
        if (!notificacao.usuarioId) {
            return null
        }

        const dados =
            await AsyncStorage.getItem(STORAGE_KEY)

        const atuais = dados
            ? JSON.parse(dados)
            : []

        const nova = {
            id:
                notificacao.id ||
                Date.now().toString(),

            usuarioId:
                notificacao.usuarioId,

            title: notificacao.title,

            body: notificacao.body,

            tipo:
                notificacao.tipo ||
                'geral',

            data:
                new Date().toISOString(),

            lida: false,
        }

        const atualizadas = [
            nova,
            ...atuais,
        ]

        await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(atualizadas)
        )

        return nova
    } catch (error) {
        console.log(
            'Erro ao salvar notificacao:',
            error
        )

        return null
    }
}

export async function marcarComoLida(
    id,
    usuarioId
) {
    try {
        const dados =
            await AsyncStorage.getItem(STORAGE_KEY)

        if (!dados) return []

        const todas = JSON.parse(dados)

        const atualizadas = todas.map(
            (item) => {
                if (
                    item.id === id &&
                    item.usuarioId === usuarioId
                ) {
                    return {
                        ...item,
                        lida: true,
                    }
                }

                return item
            }
        )

        await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(atualizadas)
        )

        return atualizadas.filter(
            (item) =>
                item.usuarioId === usuarioId
        )
    } catch (error) {
        console.log(
            'Erro ao marcar notificacao:',
            error
        )

        return []
    }
}

export async function marcarTodasComoLidas(
    usuarioId
) {
    try {
        const dados =
            await AsyncStorage.getItem(STORAGE_KEY)

        if (!dados) return []

        const todas = JSON.parse(dados)

        const atualizadas = todas.map(
            (item) => {
                if (
                    item.usuarioId === usuarioId
                ) {
                    return {
                        ...item,
                        lida: true,
                    }
                }

                return item
            }
        )

        await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(atualizadas)
        )

        return atualizadas.filter(
            (item) =>
                item.usuarioId === usuarioId
        )
    } catch (error) {
        console.log(
            'Erro ao marcar todas as notificacoes:',
            error
        )

        return []
    }
}