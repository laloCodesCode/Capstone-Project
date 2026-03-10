import { Text, View, StyleSheet } from "react-native";
import  { Card } from "../../src/components/item_listing";


export default function HomeScreen() {
    return (

        <View style= {styles.container}>
            <Card/>
            <Card/>
            <Card/>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 20,
        marginHorizontal: 20
        
        
    }
})