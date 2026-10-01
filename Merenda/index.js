import { registerRootComponent } from 'expo'

try {
    const App = require('./App').default
    registerRootComponent(App)
} catch (erro) {
    console.log('ERRO AO CARREGAR O APP:', erro)
    console.log('MENSAGEM:', erro?.message)
}