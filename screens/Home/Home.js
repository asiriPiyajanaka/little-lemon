import {
  View,
  Image,
  Text,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  TextInput,
} from "react-native";
import cook from "../images/cook.png";
import { styles } from "./homeStyles";
import { useCallback, useMemo, useEffect, useState } from "react";
import { menuDataUrl } from "./apiDefinitions";
import debounce from "lodash.debounce";
import MenuItem from "./MenuItem";
import {
  createTable,
  filterByQueryAndCategories,
  getMenuItems,
  saveMenuItems,
} from "../../database";
import CategorySelector from "./CategorySelector";

export default function Home() {
  const [menuData, setMenuData] = useState([]);
  const categories = ["starters", "mains", "desserts", "drinks", "specials"];
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [filterSelections, setFilterSelections] = useState(
    categories.map(() => false)
  );

  const fetchData = async () => {
    let fetchedData = [];
    try {
      const res = await fetch(menuDataUrl);
      fetchedData = await res.json();
    } catch (error) {
      console.log("Error fetching data:", error);
    }
    return fetchedData;
  };

  useEffect(() => {
    (async () => {
      try {
        await createTable();
        let menuItems = await getMenuItems();

        if (!menuItems.length) {
          const menuItems = await fetchData();
          saveMenuItems(menuItems.menu);
        }
        menuItems = await getMenuItems();
        setMenuData(menuItems);
      } catch (e) {
        console.log("error saving data in db", e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const activeCats = categories.filter((str, index) => {
        if (filterSelections.every((sel) => sel === false)) {
          return true;
        }
        return filterSelections[index];
      });

      try {
        const menuItems = await filterByQueryAndCategories(query, activeCats);
        setMenuData(menuItems);
      } catch (error) {
        console.log("error filtering by cats", error);
      }
    })();
  }, [filterSelections, query]);

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearch(text);
    debouncedLookup(text);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.body}>
        <View style={styles.bodyContent}>
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
        <TextInput
          style={styles.searchBar}
          value={search}
          onChangeText={handleSearchChange}
          placeholder="Search"
        />
      </View>
      <View style={{ height: 80, alignSelf: "flex-start", paddingLeft: 15 }}>
        <Text style={styles.deliveryHeader}>ORDER FOR DELIVERY!</Text>
        <CategorySelector
          filterSelections={filterSelections}
          setFilterSelections={setFilterSelections}
          categories={categories}
        />
      </View>
      <FlatList
        contentContainerStyle={{ alignItems: "stretch", paddingHorizontal: 15 }}
        data={menuData}
        renderItem={({ item }) => <MenuItem data={item} />}
        keyExtractor={(item) => item.name}
      />
    </KeyboardAvoidingView>
  );
}
