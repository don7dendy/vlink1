import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Button,
} from 'react-native';

export default function List({ item, refreshContacts  }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [firstName, setFirstName] = useState(item.firstName);
  const [lastName, setLastName] = useState(item.lastName);
  const [age, setAge] = useState(item.age.toString());
  const [photo, setPhoto] = useState(item.photo);

 const onPressRemove = (id) => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to remove this contact?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            fetch(`https://contact.herokuapp.com/contact/${id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            })
            .then(response => {
                if (response.status === 200) {
                  // Contact deleted successfully
                  console.log('Contact deleted successfully');
                  setModalVisible(false);
                  refreshContacts();
                } 
                else if (response.status === 400) {
                    console.error('Failed to delete contact. Status:', response.status);
                } 
                else {
                  // Handle other status codes
                  console.error('Failed to delete contact. Status:', response.status);
                }
              })
              .catch(error => {
                console.error('Error updating contact:', error);
                // Handle error
              });
          },
        },
      ],
      { cancelable: false }
    );
  };


  const onPressUpdate = () => {
    setModalVisible(true);
  };

  const onUpdate = (id) => {
    if (!firstName || !lastName || !age || !photo) {
      Alert.alert('All fields are required');
      return;
    }
  
    const updatedContact = {
      firstName: firstName,
      lastName: lastName,
      age: parseInt(age),
      photo: photo
    };
  
    fetch(`https://contact.herokuapp.com/contact/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: (updatedContact)
    })
      .then(response => {
        console.log("error", response.status)
        if (response.status === 200) {
          // Contact updated successfully
          console.log('Contact updated successfully');
          setModalVisible(false);
          refreshContacts();
        } 
        else if (response.status === 400) {
            console.error('Failed to update contact. Status:', response.status);
        } 
        else {
          // Handle other status codes
          console.error('Failed to update contact. Status:', response.status);
          // You can handle other status codes here, if needed
        }
      })
      .catch(error => {
        console.error('Error updating contact:', error);
        // Handle error
      });
  };

  return (
    <View
      style={{
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#ffff',
        marginVertical: 10,
        borderRadius: 5,
        padding: 5,
        elevation: 5,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 5,
        }}>
        <Text
          onPress={onPressUpdate}
          style={{
            color: '#000',
            fontSize: 20,
            borderBottomWidth: 1,
            marginBottom: 10,
          }}>
          Update
        </Text>
        <TouchableOpacity onPress={onPressRemove}>
          <Text
            style={{
              color: '#000',
              fontSize: 20,
              borderBottomWidth: 1,
              marginBottom: 10,
            }}>
            Remove
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={{ uri: item.photo }}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
        <Text style={{ marginLeft: 10, color: '#000' }}>
          {item.firstName} {item.lastName}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
        <Text style={{ alignSelf: 'flex-end', color: '#000' }}>Age : {item.age}</Text>
      </View>

      {/* Update Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalView}>
          <Text>Update Contact</Text>
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
            placeholder="please input your new photo url"
          />
          <View style={styles.buttonContainer}>
            <Button title="Update" onPress={onUpdate} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

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
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '100%',
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },  
});
