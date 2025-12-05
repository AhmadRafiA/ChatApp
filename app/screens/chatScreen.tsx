import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from "react-native-image-picker";

import {
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  collection,
} from "../firebase";

import { db } from "../firebase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Chat">;

type MessageType = {
  id: string;
  text?: string;
  imageId?: string;
  user: string;
  createdAt: any;
};

export default function ChatScreen({ route }: Props) {
  const { myId, otherId, otherEmail } = route.params;
  const roomId = myId < otherId ? `${myId}_${otherId}` : `${otherId}_${myId}`;

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [message, setMessage] = useState("");
  const [localImages, setLocalImages] = useState<Record<string, string>>({});

  const loadLocalImages = async (msgs: MessageType[]) => {
    const newImgs: Record<string, string> = {};

    for (const m of msgs) {
      if (m.imageId) {
        const key = "img_" + m.imageId;
        const b64 = await AsyncStorage.getItem(key);
        if (b64) newImgs[m.imageId] = b64;
      }
    }

    setLocalImages(newImgs);
  };

  useEffect(() => {
    const q = query(
      collection(db, "chats", roomId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, async (snap) => {
      const arr: MessageType[] = [];
      snap.forEach((doc) => arr.push({ id: doc.id, ...doc.data() } as MessageType));
      setMessages(arr);

      loadLocalImages(arr);
    });

    return unsub;
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    await addDoc(collection(db, "chats", roomId, "messages"), {
      text: message,
      user: myId,
      createdAt: serverTimestamp(),
    });

    setMessage("");
  };

  const sendImage = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      includeBase64: true,
      quality: 0.7,
    });

    if (!result.assets?.[0].base64) return;

    const b64 = result.assets[0].base64;
    const imageId = Date.now().toString();

    await AsyncStorage.setItem("img_" + imageId, b64);

    await addDoc(collection(db, "chats", roomId, "messages"), {
      imageId,
      user: myId,
      createdAt: serverTimestamp(),
    });
  };

  const renderItem = ({ item }: { item: MessageType }) => {
    const isMe = item.user === myId;
    const b64 = item.imageId ? localImages[item.imageId] : undefined;

    return (
      <View style={[styles.msgBox, isMe ? styles.me : styles.other]}>
        <Text style={styles.sender}>
          {isMe ? "Saya" : otherEmail}
        </Text>

        {item.text && <Text>{item.text}</Text>}

        {b64 && (
          <Image
            source={{ uri: "data:image/jpeg;base64," + b64 }}
            style={styles.image}
          />
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={messages}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ketik pesan..."
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Kirim" onPress={sendMessage} />
      </View>

      <Button title="Upload Gambar" onPress={sendImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  msgBox: { padding: 10, marginBottom: 10, borderRadius: 6, maxWidth: "80%" },
  me: { backgroundColor: "#cfe9ff", alignSelf: "flex-end" },
  other: { backgroundColor: "#eee", alignSelf: "flex-start" },
  sender: { fontSize: 12, fontWeight: "bold" },
  inputRow: { flexDirection: "row", padding: 10, borderTopWidth: 1 },
  input: { flex: 1, borderWidth: 1, padding: 10, borderRadius: 8, marginRight: 10 },
  image: { width: 200, height: 200, marginTop: 5, borderRadius: 10 },
});
