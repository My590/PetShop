import {View, Text, Button} from 'react-native'

export default function Home(){
    return(
        <View>
            <Text> Seja bem-vindo(a)</Text>
            <Button>
                title = "Sair"
                onPress = {()=>alert('Sair em contrução')}
    
            </Button>

        </View>
    )

}