import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { aiService } from "../services/ai-service";
import { eventService } from "../services/event-service";

type Message = {
  id: string;
  role: "student" | "assistant";
  text: string;
};

export default function AIAssistantScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      text: "Bonjour ! Je suis l'assistant IA du campus FST Tanger. Comment puis-je t'aider concernant nos événements ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Fetch events context
  const { data: events } = useQuery({
    queryKey: ["allEvents"],
    queryFn: eventService.fetchAllEvents,
  });

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userQuery = input.trim();
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "student",
      text: userQuery,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Format context
      const eventsContext = events
        ? events.map(e => `- Titre: ${e.title}, Date: ${new Date(e.date).toLocaleDateString()}, Lieu: ${e.location}\n  Description: ${e.description}`).join("\n\n")
        : "Aucun événement disponible pour le moment.";

      const aiResponseText = await aiService.askCampusAI(userQuery, eventsContext);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: aiResponseText,
        },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: "Désolé, une erreur s'est produite lors de la connexion au serveur IA (Gemini 3 Flash). Veuillez réessayer.",
        },
      ]);
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Feather name="cpu" size={20} color="#0066cc" style={styles.headerIcon} />
        <Text style={styles.headerTitle}>Campus AI Assistant</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => {
            const isStudent = item.role === "student";
            return (
              <View
                style={[
                  styles.messageWrapper,
                  isStudent ? styles.messageStudentWrapper : styles.messageAssistantWrapper,
                ]}
              >
                {!isStudent && (
                  <View style={styles.assistantAvatar}>
                    <Feather name="cpu" size={12} color="#aaaaaa" />
                  </View>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    isStudent ? styles.messageStudent : styles.messageAssistant,
                  ]}
                >
                  <Text style={[styles.messageText, isStudent ? styles.textStudent : styles.textAssistant]}>
                    {item.text}
                  </Text>
                </View>
              </View>
            );
          }}
          ListFooterComponent={
            isTyping ? (
              <View style={styles.typingContainer}>
                <ActivityIndicator size="small" color="#aaaaaa" />
                <Text style={styles.typingText}>Gemini réfléchit...</Text>
              </View>
            ) : null
          }
        />

        <View style={styles.inputSection}>
          <TextInput
            style={styles.inputBox}
            placeholder="Posez votre question..."
            placeholderTextColor="#888888"
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || isTyping) && styles.sendBtnDisabled]}
            disabled={!input.trim() || isTyping}
            onPress={handleSend}
          >
            <Feather name="send" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
    backgroundColor: "#121212",
  },
  backBtn: {
    marginRight: 16,
    padding: 4,
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  chatContainer: {
    padding: 20,
    paddingBottom: 20,
  },
  messageWrapper: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-end",
  },
  messageStudentWrapper: {
    justifyContent: "flex-end",
  },
  messageAssistantWrapper: {
    justifyContent: "flex-start",
  },
  assistantAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#1e1e1e",
    borderWidth: 1,
    borderColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  messageStudent: {
    backgroundColor: "#0066cc",
    borderBottomRightRadius: 4,
  },
  messageAssistant: {
    backgroundColor: "#1e1e1e",
    borderWidth: 1,
    borderColor: "#333333",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  textStudent: {
    color: "#ffffff",
  },
  textAssistant: {
    color: "#cccccc",
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginLeft: 32,
  },
  typingText: {
    color: "#aaaaaa",
    fontSize: 12,
    marginLeft: 8,
    fontStyle: "italic",
  },
  inputSection: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#121212",
    borderTopWidth: 1,
    borderTopColor: "#222222",
    alignItems: "flex-end",
  },
  inputBox: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    color: "#ffffff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 12 : 10,
    paddingBottom: Platform.OS === 'ios' ? 12 : 10,
    minHeight: 44,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#333333",
    marginRight: 12,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0066cc",
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnDisabled: {
    backgroundColor: "#1e1e1e",
    borderWidth: 1,
    borderColor: "#333333",
  },
});
