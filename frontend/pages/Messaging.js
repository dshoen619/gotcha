import React, { useLayoutEffect, useState, useEffect, useRef } from "react";
import { View, TextInput, Text, FlatList, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MessageComponent from "../components/MessageComponent";
import { styles } from "../utils/styles";
import socket from "../utils/socket";
import { useFonts, Cormorant_500Medium } from '@expo-google-fonts/cormorant';

const Messaging = ({ route, navigation }) => {
  const [fontsLoaded] = useFonts({
    Cormorant_500Medium,
  });

  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [user, setUser] = useState('');
  const [taskerEmail, setTaskerEmail] = useState(route.params.moverInfo.email);
  const [userToken, setUserToken] = useState("");
  const flatListRef = useRef(null)

  const taskerInfo = route.params.moverInfo;
  const taskerFirstName = taskerInfo.first_name;

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({animated:false})
    }
  })

  useEffect(() => {
    const fetchUserTokenAndJoinRoom = async () => {
      try {
        const userTokenStorage = await AsyncStorage.getItem('userToken');
        console.log('utstorage', userTokenStorage);

        if (userTokenStorage) {
          setUserToken(userTokenStorage);
          console.log('userToken', userTokenStorage);

          socket.emit('findRoom', { taskerEmail, userToken: userTokenStorage });
        }
      } catch (error) {
        console.error('Error fetching user token', error);
      }
    };

    fetchUserTokenAndJoinRoom();
  }, []);

  useEffect(() => {
    socket.on("roomMessages", ({ messages, userEmail }) => {
      setChatMessages(messages);
      setUserEmail(userEmail);

      console.log('messages', messages);
      console.log(userEmail);
    });

    return () => {
      socket.off("roomMessages");
    };
  }, []);

  useEffect(() => {
    console.log('Updated userEmail:', userEmail);
  }, [userEmail]);

  const handleNewMessage = () => {
    const now = new Date();

    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const date = now.toLocaleDateString('en-GB', dateOptions);

    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    const time = now.toLocaleTimeString('en-GB', timeOptions);

    const timestamp = `${date} ${time}`;

    const newMessage = {
      id: Date.now().toString(),
      text: message,
      userEmail,
      created_at: now,
      timestamp,
    };
    console.log('userEmail in handleNewMessage:', userEmail);

    setChatMessages(prevMessages => [...prevMessages, newMessage]);

    socket.emit('newMessage', { message, timestamp, userEmail, taskerEmail, userToken });

    setMessage('');
  };

  const renderItem = ({ item, index }) => {
    const messageDate = new Date(item.created_at).toDateString();
    const previousDate = index > 0 ? new Date(chatMessages[index - 1].created_at).toDateString() : null;

    const isNewDay = messageDate !== previousDate;

    return (
      <View>
        {isNewDay && (
          <Text style={styles.dateHeader}>{messageDate}</Text>
        )}
        <MessageComponent item={item} user={user} />
      </View>
    );
  };

  return (
    <View style={styles.messagingscreen}>
      <View style={styles.messagingScreenHeader}>
        <Text style={styles.headerText}>{taskerFirstName}</Text>
      </View>
      <View
        style={[
          styles.messagingscreen,
          { paddingVertical: 15, paddingHorizontal: 10, marginTop: 30 },
        ]}
      >
        {chatMessages.length > 0 ? (
          <FlatList
            data={chatMessages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ref={flatListRef}
            onContentSizeChange={() => flatListRef.current.scrollToEnd({animated:false})}
            onLayout ={ () => flatListRef.current.scrollToEnd({animated:false})}
          />
        ) : null}
      </View>

      <View style={styles.messaginginputContainer}>
        <TextInput
          style={styles.messaginginput}
          value={message}
          onChangeText={(value) => setMessage(value)}
        />
        <Pressable
          style={styles.messagingbuttonContainer}
          onPress={handleNewMessage}
        >
          <View>
            <Text style={{ color: "#f2f0f1", fontSize: 20 }}>SEND</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default Messaging;
