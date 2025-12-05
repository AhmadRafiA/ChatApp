import React, { useState } from "react";
import { 
  View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ActivityIndicator
} from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

import { auth, createUserWithEmailAndPassword, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Isi email & password dulu!");
      return;
    }

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      await setDoc(doc(db, "users", uid), {
        uid: uid,
        email: email,
        createdAt: Date.now(),
      });

      Alert.alert("Berhasil daftar!", email);

      navigation.navigate("Users");

    } catch (e: any) {
      Alert.alert("Gagal daftar", e.message);
      console.log("REGISTER ERROR:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daftar Akun Baru</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.btn} onPress={register} disabled={loading}>
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>Daftar</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 100 },
  title: { fontSize: 22, marginBottom: 15, textAlign: "center" },
  input: { borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 12 },
  btn: { backgroundColor: "#4a90e2", padding: 14, borderRadius: 10, alignItems: "center" },
  btnText: { color: "white", fontWeight: "bold" },
});
