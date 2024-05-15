import {
  FlatList,
  StyleSheet,
  View,
  Button,
  Modal,
  Text,
  TextInput,
  Alert
} from 'react-native';
import React, { useState, useEffect, useCallback  } from 'react';
import List from '../src/List';

const Home = () => {
  const [contacts, setContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [photo, setPhoto] = useState('');
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    fetchContacts();
  }, [searchId]);

  const fetchContacts = () => {
    if (searchId.trim() !== '') {
      fetch(`https://contact.herokuapp.com/contact/${searchId}`)
        .then(response => response.json())
        .then(data => {
          if (data && data.data) {
            setContacts([data.data]);
          } else {
            setContacts([]);
          }
        })
        .catch(error => console.error(error));
    } else {
      fetch('https://contact.herokuapp.com/contact')
        .then(response => response.json())
        .then(data => {
          if (data && data.data) {
            setContacts(data.data);
          }
        })
        .catch(error => console.error(error));
    }
  };

  const onAdd = () => {
    setModalVisible(true);
  };

  const handleAddContact = () => {
    if (!firstName || !lastName || !age || !photo) {
      Alert.alert('All fields are required');
      return;
    }
  
    const newContact = {
      firstName: firstName,
      lastName: lastName,
      age: parseInt(age),
      photo: photo
    };
  
    fetch('https://contact.herokuapp.com/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newContact)
    })
      .then(response => {
        if (response.status === 201) {
          // Contact added successfully
          console.log('New contact added successfully');
          setModalVisible(false);
          setSearchId(''); // Refresh contacts list
        } else if (response.status === 400) {
          // Bad request
          response.json().then(data => {
            console.error('Failed to add contact. Status:', response.status);
            console.error('Response:', data);
          });
        } else {
          // Handle other status codes
          console.error('Failed to add contact. Status:', response.status);
          // You can handle other status codes here, if needed
        }
      })
      .catch(error => {
        console.error('Error adding new contact:', error);
        // Handle error
      });
  };
  
  const refreshContacts = useCallback(() => {
    fetchContacts();
  }, [searchId]);
  
  return (
    <View style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
      <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
        <Button
          title="ADD CONTACT"
          onPress={onAdd}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
        <TextInput
          style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, paddingLeft: 10 }}
          placeholder="Enter ID"
          onChangeText={text => setSearchId(text)}
          value={searchId}
        />
      </View>
      <FlatList
        data={contacts}
        renderItem={({ item }) => <List item={item} refreshContacts={refreshContacts}/>}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Add Contact Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalView}>
          <Text>Add Contact</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            onChangeText={text => setFirstName(text)}
            value={firstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            onChangeText={text => setLastName(text)}
            value={lastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            onChangeText={text => setAge(text)}
            value={age}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            onChangeText={text => setPhoto(text)}
            placeholder="Photo URL"
          />
          <View style={styles.buttonContainer}>
            <Button title="Add" onPress={handleAddContact} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    marginTop: 150,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '100%',
    padding: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
  }
});

export default Home;
