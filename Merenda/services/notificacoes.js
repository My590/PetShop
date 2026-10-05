import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

const STORAGE_KEY = '@petcare_notificacoes'
const CHANNEL_ID = 'petcare-notificacoes'

// ======================================================
// CONFIGURAÇÃO PARA MOSTRAR NOTIFICAÇÕES COM O APP ABERTO
// ======================================================

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

// ======================================================
// CONFIGURA AS NOTIFICAÇÕES DO CELULAR
// ======================================================

export async function configurarNotificacoes() {
  try {
    // Android precisa de um canal de notificação
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(
        CHANNEL_ID,
        {
          name: 'Notificações do PetCare',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          sound: 'default',
        }
      )
    }

    // Verifica se já temos permissão
    const permissoesAtuais =
      await Notifications.getPermissionsAsync()

    let status = permissoesAtuais.status

    // Se ainda não tiver, solicita
    if (status !== 'granted') {
      const permissoes =
        await Notifications.requestPermissionsAsync()

      status = permissoes.status
    }

    if (status !== 'granted') {
      console.log(
        'Permissão para notificações não concedida.'
      )

      return false
    }

    console.log(
      'Notificações do PetCare configuradas com sucesso.'
    )

    return true
  } catch (error) {
    console.log(
      'Erro ao configurar notificações:',
      error
    )

    return false
  }
}

// ======================================================
// BUSCA AS NOTIFICAÇÕES DA TELA "NOTIFICAÇÕES"
// ======================================================

export async function obterNotificacoes(usuarioId) {
  try {
    if (!usuarioId) {
      return []
    }

    const dados =
      await AsyncStorage.getItem(STORAGE_KEY)

    if (!dados) {
      return []
    }

    const todas = JSON.parse(dados)

    return todas.filter(
      (item) =>
        item.usuarioId === usuarioId
    )
  } catch (error) {
    console.log(
      'Erro ao carregar notificações:',
      error
    )

    return []
  }
}

// ======================================================
// SALVA A NOTIFICAÇÃO + ENVIA PARA A BARRA DO CELULAR
// ======================================================

export async function salvarNotificacao(notificacao) {
  try {
    if (!notificacao.usuarioId) {
      console.log(
        'Não foi possível salvar: usuário não encontrado.'
      )

      return null
    }

    // --------------------------------------------------
    // 1. SALVA NO SISTEMA INTERNO DO APP
    // --------------------------------------------------

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

      title:
        notificacao.title,

      body:
        notificacao.body,

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

    // --------------------------------------------------
    // 2. CONFIGURA PERMISSÕES
    // --------------------------------------------------

    const permitido =
      await configurarNotificacoes()

    // --------------------------------------------------
    // 3. ENVIA A NOTIFICAÇÃO PARA O CELULAR
    // --------------------------------------------------

    if (permitido) {
      try {
        const notificationId =
          await Notifications.scheduleNotificationAsync({
            content: {
              title: notificacao.title,
              body: notificacao.body,

              data: {
                notificacaoId: nova.id,
                usuarioId:
                  notificacao.usuarioId,
                tipo:
                  notificacao.tipo ||
                  'geral',
              },

              sound: 'default',
            },

            // null = mostrar imediatamente
            trigger: null,
          })

        console.log(
          'Notificação enviada para o celular:',
          notificationId
        )
      } catch (notificationError) {
        console.log(
          'Erro ao enviar notificação para o celular:',
          notificationError
        )
      }
    }

    return nova
  } catch (error) {
    console.log(
      'Erro ao salvar notificação:',
      error
    )

    return null
  }
}

// ======================================================
// MARCA UMA NOTIFICAÇÃO COMO LIDA
// ======================================================

export async function marcarComoLida(
  id,
  usuarioId
) {
  try {
    const dados =
      await AsyncStorage.getItem(STORAGE_KEY)

    if (!dados) {
      return []
    }

    const todas = JSON.parse(dados)

    const atualizadas =
      todas.map((item) => {
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
      })

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
      'Erro ao marcar notificação:',
      error
    )

    return []
  }
}

// ======================================================
// MARCA TODAS COMO LIDAS
// ======================================================

export async function marcarTodasComoLidas(
  usuarioId
) {
  try {
    const dados =
      await AsyncStorage.getItem(STORAGE_KEY)

    if (!dados) {
      return []
    }

    const todas = JSON.parse(dados)

    const atualizadas =
      todas.map((item) => {
        if (
          item.usuarioId === usuarioId
        ) {
          return {
            ...item,
            lida: true,
          }
        }

        return item
      })

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
      'Erro ao marcar todas as notificações:',
      error
    )

    return []
  }
}