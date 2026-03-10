import React from "react";
import { View, StyleSheet, Text } from "react-native";

export function Card() {
    return (
        <View style = {styles.box}>
            <View>


            </View>
            <Text>
                Price:
            </Text>
            <Text>Title</Text>

        </View>
        )
}

const styles = StyleSheet.create({
    box: {
        borderWidth:1,
        padding: 20,
        flex: 1
    }
    })
