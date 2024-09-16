import {React, useState, useLayoutEffect, useEffect} from "react";
import { View, Text, Pressable, SafeAreaView, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";
import socket from '../utils/socket.js'
import ChatComponent from "../components/ChatComponent";
import { styles } from "../utils/styles";

const Chat = () => {
    const [rooms, setRooms] = useState([]);
    

    //👇🏻 Runs when the component mounts
    useLayoutEffect(() => {
        function fetchGroups() {
            fetch("http://localhost:3000/chat/rooms")
                .then((res) => res.json())
                .then((data) => setRooms(data))
                .catch((err) => console.error(err));
        }
        fetchGroups();
    }, []);
    
    //👇🏻 Runs whenever there is new trigger from the backend
    useEffect(() => {
        socket.on("roomsList", (rooms) => {
            setRooms(rooms);
        });
    }, [socket]);

   

    return (
        <SafeAreaView style={styles.chatscreen}>
            <View style={styles.chattopContainer}>
                <View style={styles.chatheader}>
                    <Text style={styles.chatheading}>Chats</Text>
                </View>
            </View>

            <View style={styles.chatlistContainer}>
                {rooms.length > 0 ? (
                    <FlatList
                        data={rooms}
                        renderItem={({ item }) => <ChatComponent item={item} />}
                        keyExtractor={(item) => item.id}
                    />
                ) : (
                    <View style={styles.chatemptyContainer}>
                        <Text style={styles.chatemptyText}>No Messages Yet!</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default Chat;
