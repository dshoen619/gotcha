import { View, Text, ScrollView } from "react-native";
import React, {useRef,useEffect} from "react";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../utils/styles";

export default function MessageComponent({ item, user }) {
    const scrollViewRef = useRef(null);

    useEffect(() => {
        // Scroll to the bottom when the component first renders
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [item]);

    const isCurrentUser = item.user_id === user;
    const time = new Date(item.created_at);
    const hours = time.getUTCHours();
    const minutes = time.getUTCMinutes();

    return (
        <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        >
            <View style={styles.messageContainer}>
                <View style={[styles.messageWrapper, isCurrentUser && styles.currentUserWrapper]}>
                    {!isCurrentUser && (
                        <Ionicons
                            name="person-circle-outline"
                            size={30}
                            color="black"
                            style={styles.avatar}
                        />
                    )}
                    <View style={[styles.message, isCurrentUser && styles.currentUserMessage]}>
                        <Text>{item.body}</Text>
                    </View>
                </View>
                <Text style={[styles.timestamp, isCurrentUser && styles.currentUserTimestamp]}>
                    {hours}:{minutes}
                </Text>
            </View>
        </ScrollView>
    );
}