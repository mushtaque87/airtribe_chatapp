/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
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
    const newSocket = io('http://localhost:3000'); // replace with your server URL
    setSocket(() => newSocket);

    newSocket.on('chat message', chat => {
      console.log('received chat message', chat, chats);
      // setChats(chat => [...chats, chat]);
      setChats(chats => [...chats, chat]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [chats]);

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
                borderColor: 'gray',
                borderWidth: 1,
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
                borderColor: 'gray',
                borderWidth: 1,
                marginHorizontal: 10,
              }}
              placeholder="Room name"
              onChangeText={text => setRoomName(text)}
              value={roomName}
            />
            <Button
              title="Enter"
              onPress={() => {
                console.log('Button pressed!');
                if (socket) {
                  socket.emit('join room', roomName, userName);
                }
              }}
            />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', marginTop: 50 }}>
            <TextInput
              style={{
                width: '50%',
                alignItems: 'center',
                height: 40,
                borderColor: 'gray',
                borderWidth: 1,
              }}
              onChangeText={text => setChat(text)}
              value={chat}
            />
            <Button
              title="Send"
              onPress={() => {
                console.log('Button pressed!');
                if (socket) {
                  socket.emit('chat message', roomName, chat);
                }
              }}
            />
          </View>
          <FlatList
            data={chats}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <Text>{item.msg}</Text>}
          />
        </View>
      </ScrollView>
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
});

export default App;
