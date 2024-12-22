import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import io from 'socket.io-client';
import axios from 'axios';
import sodium from 'libsodium-wrappers';

const ChatScreen = ({ route }) => {
  const { token } = route.params;
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const socket = io('http://localhost:3000', {
    query: { token }
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:3000/messages', {
          headers: { Authorization: token }
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    socket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
    const key = sodium.crypto_secretbox_keygen();
    const encryptedContent = sodium.crypto_secretbox_easy(content, nonce, key);
    socket.emit('sendMessage', { content: encryptedContent, receiverId: 1 });
    setContent('');
  };

  return (
    <View>
      <FlatList
        data={messages}
        renderItem={({ item }) => <Text>{item.content}</Text>}
        keyExtractor={(item) => item.id.toString()}
      />
      <TextInput value={content} onChangeText={setContent} />
      <Button title="Send" onPress={handleSendMessage} />
    </View>
  );
};

export default ChatScreen;
