import React, { useContext, useEffect, useState } from "react";
import { View, Image, StyleSheet, Text, Pressable } from "react-native";
import arrow from "../images/arrow-left.png";
import logo from "../images/Logo.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../../AppContext";

export default function ProfileNavHeader() {
  const [isLoading, setIsLoading] = useState(false);
  const [userFirstName, setUserFirstName] = useState("");
  const navigation = useNavigation();
  const [navImage, setNavImage] = useState("");
  const { image } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const firstName = await AsyncStorage.getItem("firstName");
        const userImage = await AsyncStorage.getItem("userImage");
        setUserFirstName(firstName);
        setNavImage(userImage);
      } catch (error) {
        console.log("get profile nav async val error", error);
      }
      setIsLoading(false);
    })();
  }, [image]);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.backContainer}
        onPress={() => navigation.goBack()}
      >
        <Image source={arrow} style={styles.backImage} />
      </Pressable>
      <Image source={logo} style={styles.logo} />
      {navImage && <Image source={{ uri: navImage }} style={styles.avatar} />}
      {!navImage && (
        <View style={styles.avatar}>
          {userFirstName && (
            <Text style={{ fontSize: 22, color: "white" }}>
              {userFirstName.slice(0, 2).toUpperCase()}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 30,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  logo: {
    resizeMode: "contain",
    height: 70,
    width: 200,
  },
  avatar: {
    height: 44,
    width: 44,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: "black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
  },
  backContainer: {
    height: 44,
    width: 44,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 90,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  backImage: {
    height: 32,
    width: 32,
    resizeMode: "contain",
  },
});
