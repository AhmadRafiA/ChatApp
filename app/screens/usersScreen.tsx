import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { auth } from "../firebase";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Users">;

export default function UsersScreen({ navigation }: Props) {
  const [users, setUsers] = useState<any[]>([]);
  const myId = auth.currentUser?.uid;

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      const arr: any[] = [];
      snap.forEach((doc) => {
        if (doc.id !== myId) {
          arr.push({ id: doc.id, ...doc.data() });
        }
      });
      setUsers(arr);
    });

    return () => unsub();
  }, []);

  const openChat = (other: any) => {
    navigation.navigate("Chat", {
      myId: myId!,
      otherId: other.uid,
      otherEmail: other.email,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daftar Pengguna</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => openChat(item)}>
            <Text style={styles.email}>{item.email}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50 },

  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },

  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  email: {
    fontSize: 18,
  },
});
