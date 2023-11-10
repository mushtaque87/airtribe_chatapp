/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

import type { PropsWithChildren } from 'react';
import {
  Button,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import io, { Socket } from 'socket.io-client';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { DefaultEventsMap } from '@socket.io/component-emitter';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [userName, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const [chat, setChat] = useState('');

  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);

  const [chats, setChats] = useState<[string]>(['']);

  useEffect(() => {
    const newSocket = io('http://localhost:9000'); // replace with your server URL
    setSocket(() => newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [chats, roomName]);

  useEffect(() => {
    if (!socket) return;
    socket.on('chat-message', chat => {
      console.log('received chat message', userName, chat, chats);
      console.log('roomName', roomName, chat.room);
      // setChats(chat => [...chats, chat]);
      if (roomName && chat.room && roomName === chat.room)
        setChats(chats => [...chats, chat]);
    });

    socket.on('join-room', chat => {
      console.log('join-room', chat);
      // setChats(chat => [...chats, chat]);
      setChats(chats => [...chats, chat]);
    });
  }, [socket, userName, roomName]);

  const renderItem = (item: any, index: number) => {
    return (
      <View>
        <Text></Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            flex: 1,
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginTop: 50,
              alignContent: 'space-between',
              width: '100%',
            }}>
            <TextInput
              style={{
                width: '30%',
                alignItems: 'center',

                height: 40,
                ...styles.input,
              }}
              placeholder="Username"
              onChangeText={text => setUsername(text)}
              value={userName}
            />
            <TextInput
              style={{
                width: '30%',
                alignItems: 'center',
                height: 40,
                ...styles.input,
                marginHorizontal: 10,
              }}
              placeholder="Room name"
              onChangeText={text => setRoomName(text)}
              value={roomName}
            />
            <Button
              title="Enter"
              onPress={() => {
                if (!roomName || !userName) {
                  console.log('Please enter a room and user name');
                  Toast.show({
                    type: 'error',
                    text1: 'Warning',
                    text2: 'Please enter a room and user name 👋',
                  });
                  return;
                }
                if (socket && userName && roomName) {
                  socket.emit('join-room', roomName, userName);
                }
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginTop: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextInput
              style={{
                width: '80%',
                alignItems: 'center',
                height: 40,
                ...styles.input,
              }}
              onChangeText={text => {
                setChat(text);
              }}
              value={chat}
            />
            <Button
              title="Send"
              onPress={() => {
                console.log('Button pressed!');
                if (!roomName) {
                  console.log('Please enter a room');
                  Toast.show({
                    type: 'error',
                    text1: 'Warning',
                    text2: 'Please enter a room 👋',
                  });
                  return;
                }
                if (socket) {
                  socket.emit('chat-message', roomName, userName, chat);
                  setChat('');
                }
              }}
            />
          </View>
          {chats && (
            <FlatList
              data={chats}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.item,
                    {
                      backgroundColor:
                        item.username === userName ? '#d9ead3' : '#cd9afe',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.itemText,
                      {
                        textAlign:
                          item.username === userName ? 'right' : 'left',
                      },
                    ]}>
                    {item.msg}
                  </Text>
                </View>
              )}
            />
          )}
          <Button
            title="Disconnect"
            onPress={() => {
              console.log('Button pressed!');
              if (socket) {
                socket.disconnect();
              }
            }}
          />
        </View>
      </ScrollView>
      <Toast position="top" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    margin: 10,
  },
  item: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    margin: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#000',
  },
});

export default App;
