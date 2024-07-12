import React, { useState, useEffect, useContext } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  Platform,
  View,
  TextInput,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { styles } from "./profileStyles";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { AppContext } from "../../AppContext";
import {
  validateEmail,
  validateName,
  validatePhone,
} from "../utils/validations";

export default function Profile() {
  const [clearLoading, setClearLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [orderChecked, setOrderChecked] = useState(false);
  const [passwordChecked, setPasswordChecked] = useState(false);
  const [specialChecked, setSpecialChecked] = useState(false);
  const [newslettersChecked, setNewslettersChecked] = useState(false);
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { setOnboardingComplete, image, setImage } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const email = await AsyncStorage.getItem("email");
        const firstName = await AsyncStorage.getItem("firstName");
        const lastName = await AsyncStorage.getItem("lastName");
        const phone = await AsyncStorage.getItem("number");
        const userImage = await AsyncStorage.getItem("userImage");
        const userChecked = await AsyncStorage.getItem("checkedVals");
        const parsedChecked = JSON.parse(userChecked);
        setUserEmail(email);
        setUserFirstName(firstName);
        setUserLastName(lastName);
        setPhoneNumber(phone);
        setImage(userImage);
        if (parsedChecked) {
          setOrderChecked(parsedChecked.orderChecked);
          setPasswordChecked(parsedChecked.passwordChecked);
          setSpecialChecked(parsedChecked.specialChecked);
          setNewslettersChecked(parsedChecked.newslettersChecked);
        }
      } catch (error) {
        console.log("get profile async val error", error);
      }
      setIsLoading(false);
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const checkboxConfig = [
    {
      labelText: "Order statuses",
      stateVal: orderChecked,
      setVal: setOrderChecked,
    },
    {
      labelText: "Password changes",
      stateVal: passwordChecked,
      setVal: setPasswordChecked,
    },
    {
      labelText: "Special offers",
      stateVal: specialChecked,
      setVal: setSpecialChecked,
    },
    {
      labelText: "Newsletters",
      stateVal: newslettersChecked,
      setVal: setNewslettersChecked,
    },
  ];

  const storeProfileData = async () => {
    const checkedStringified = JSON.stringify({
      orderChecked,
      passwordChecked,
      specialChecked,
      newslettersChecked,
    });
    try {
      setIsSaveLoading(true);
      await AsyncStorage.setItem("firstName", userFirstName);
      await AsyncStorage.setItem("lastName", userLastName);
      await AsyncStorage.setItem("email", userEmail);
      if (image) await AsyncStorage.setItem("userImage", image);
      await AsyncStorage.setItem("number", phoneNumber);
      await AsyncStorage.setItem("checkedVals", checkedStringified);
      Alert.alert("Profile Info Saved!");
    } catch (error) {
      console.log("set profile data", error);
    }
    setIsSaveLoading(false);
  };

  const clearData = async () => {
    try {
      setClearLoading(true);
      await AsyncStorage.clear();
      setOnboardingComplete(false);
    } catch (error) {
      console.log("wipe storage error", error);
    }
    setClearLoading(false);
  };

  const fieldsValid = () =>
    validateEmail(userEmail) &&
    validateName(userFirstName) &&
    validateName(userLastName) &&
    validatePhone(phoneNumber);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        {isLoading && <Text>Loading...</Text>}
        {!isLoading && (
          <View style={styles.body}>
            <Text style={[styles.headerTwo, { color: "white" }]}>
              Personal Information
            </Text>
            <View>
              <Text style={styles.label}>Avatar</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 20,
                }}
              >
                {!image && (
                  <View style={[styles.avatar, { backgroundColor: "green" }]}>
                    {userFirstName && (
                      <Text style={{ fontSize: 24, color: "white" }}>
                        {userFirstName.slice(0, 2).toUpperCase()}
                      </Text>
                    )}
                  </View>
                )}
                {image && (
                  <Image source={{ uri: image }} style={styles.avatar} />
                )}
                <Pressable style={styles.changeButton} onPress={pickImage}>
                  <Text style={{ fontSize: 14, color: "white" }}>Change</Text>
                </Pressable>
                <Pressable style={styles.removeButton}>
                  <Text style={{ fontSize: 14, color: "black" }}>Remove</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.textInput}
                value={userFirstName}
                onChangeText={setUserFirstName}
              />
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.textInput}
                value={userLastName}
                onChangeText={setUserLastName}
              />
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={userEmail}
                onChangeText={setUserEmail}
              />
              <Text style={styles.label}>Phone number</Text>
              <TextInput
                style={styles.textInput}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>
          </View>
        )}
        <View style={styles.emailView}>
          <Text style={styles.headerTwo}>Email Notifications</Text>
          {checkboxConfig.map((config) => (
            <View style={styles.checkboxContainer} key={config.labelText}>
              <Checkbox value={config.stateVal} onValueChange={config.setVal} />
              <Text style={styles.checkboxLabel}>{config.labelText}</Text>
            </View>
          ))}
        </View>
        <Pressable
          style={styles.logoutButton}
          onPress={clearData}
          disabled={clearLoading}
        >
          <Text style={styles.largeButtonText}>
            {clearLoading ? "Loading..." : "Logout"}
          </Text>
        </Pressable>
        <View style={styles.bottomButtonContainer}>
          <Pressable
            style={[styles.bottomButtons, { backgroundColor: "#7c140e" }]}
          >
            <Text style={styles.smallbuttonText}>Discard Changes</Text>
          </Pressable>
          <Pressable
            style={[
              styles.bottomButtons,
              {
                backgroundColor: isSaveLoading ? "rgba(0, 0, 0, 0.5)" : "black",
                opacity: fieldsValid() ? 1 : 0.5,
              },
            ]}
            onPress={storeProfileData}
            disabled={!fieldsValid() || isSaveLoading}
          >
            <Text style={styles.smallbuttonText}>
              {isSaveLoading ? "Loading..." : "Save Changes"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
