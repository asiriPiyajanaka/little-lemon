import React from "react";
import { capitalizeFirstLetter } from "../utils/validations";
import { ScrollView, Pressable, Text } from "react-native";
import { styles } from "./homeStyles";

export default function CategorySelector({
  filterSelections,
  setFilterSelections,
  categories,
}) {
  const handleFiltersChange = async (index) => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };
  return (
    <ScrollView horizontal contentContainerStyle={styles.catScroll}>
      {categories.map((cat, i) => (
        <Pressable
          key={cat}
          style={[
            styles.catButton,
            {
              backgroundColor: filterSelections[i]
                ? "green"
                : "rgba(0, 0, 0, 0.4)",
            },
          ]}
          onPress={() => {
            handleFiltersChange(i);
          }}
        >
          <Text
            style={[
              styles.catButtonText,
              {
                color: filterSelections[i] ? "#d4f9f7" : "white",
              },
            ]}
          >
            {capitalizeFirstLetter(cat)}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
