import {
  View,
  Image,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import cook from "../images/cook.png";
import { styles } from "./onboardingStyles";
import { useContext, useState } from "react";
import { validateEmail, validateName } from "../utils/validations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "../../AppContext";

export default function Onboarding() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { setOnboardingComplete } = useContext(AppContext);

  const storeOnboardingData = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem("firstName", name);
      await AsyncStorage.setItem("email", email);
      setOnboardingComplete(true);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        <View style={styles.body}>
          <View>
            <Text style={styles.headerOne}>Little Lemon</Text>
            <Text style={styles.headerTwo}>Chicago</Text>
            <Text style={styles.textBlock}>
              We are a family owned Meditterranean restaurant, focused on
              traditional recipes served with a modern twist.
            </Text>
          </View>
          <Image source={cook} style={styles.bodyImage} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        {isLoading && (
          <Pressable style={styles.button}>
            <Text style={{ fontSize: 24, color: "white" }}>Loading...</Text>
          </Pressable>
        )}
        {!isLoading && (
          <Pressable
            style={[
              styles.button,
              { opacity: validateEmail(email) && validateName(name) ? 1 : 0.5 },
            ]}
            onPress={() => storeOnboardingData()}
            disabled={!validateEmail(email) && !validateName(name)}
          >
            <Text style={{ fontSize: 24, color: "white" }}>Next</Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
