import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

import { createToken } from "@/services/auth";

// const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;



const API_BASE = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function Index() {


  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      await createToken(username, password)

    }
    catch (error) {
      console.error(error)
    }
  }


  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>

      <TextInput
        onChangeText={setUsername}
        value={username}
        placeholder="Enter username"
        keyboardType="default"
      />

      <TextInput
        onChangeText={setPassword}
        value={password}
        placeholder="Enter password"
        keyboardType="default"
      />


      <Button
        onPress={handleLogin}
        title="Login"
      />



    </View>
  );
}



