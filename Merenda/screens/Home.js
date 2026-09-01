import {View, Text, Button} from 'react-native'
import {sair} from '../services/auth'
import {auth} from '../services/auth'

export default function Home({navigation}){

    async function realizarLogout()
    {
        await sair();
        navigation.navigate('Login')
    }

    return(
        <View>
            <Text> Seja bem-vindo(a)</Text>

            <Text> Usuário: {auth.currentUser?.email } </Text>

            <Button>
                title = "Sair"
                onPress = {realizarLogout}
    
            </Button>

        </View>
    )

}