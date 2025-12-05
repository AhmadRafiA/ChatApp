import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

import { auth, signInWithEmailAndPassword, onAuthStateChanged } from "../firebase";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate("Users");
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("Users");
    } catch (e: any) {
      Alert.alert("Login gagal: " + e.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Mengecek sesi login...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login ke ChatApp</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={login} />
      <View style={{ height: 10 }} />
      <Button title="Buat akun baru" onPress={() => navigation.navigate("Register")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 120, padding: 20 },
  title: { fontSize: 22, textAlign: "center", marginBottom: 25, fontWeight: "bold" },
  input: { borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 12 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});
