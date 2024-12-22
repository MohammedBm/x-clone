import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { hp, wp } from "@/helpers/common";
import ScreenWrapper from "@/components/ScreenWrapper";
import Input from "@/components/Input";
import { UserRoundSearch } from "lucide-react-native";
import { colorStyle, fonts } from "@/constants/Colors";
import { fetchUsersData } from "@/services/userService";
import { useRouter } from "expo-router";
import Avatar from "@/components/Avatar";

const Search = () => {
  const [data, setData] = useState([]); // Store the full list of users
  const [filteredData, setFilteredData] = useState([]); // Store the filtered list of users based on search
  const [search, setSearch] = useState(""); // Search query
  const router = useRouter();
  // Fetch users on component mount
  const fetchUsers = async () => {
    let res = await fetchUsersData();
    if (res.success) {
      setData(res.data); // Store all users in `data`
      setFilteredData(res.data); // Initially, the filtered data is the same as `data`
    } else {
      console.log("Error", res.msg);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update filtered data based on the search query
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredData(data); // If search is empty, show all users
    } else {
      const filtered = data.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(filtered); // Filter users based on the search query
    }
  }, [search, data]);

  const handleUserPress = (user) => {
    // Navigate to the Profile screen with the selected user data
    router.push({
      pathname: "/(main)/viewProfile", // Correct path to viewProfile under the /(main) folder
      params: { userId: user.id }, // Pass the user id as a query param
    });
  };

  // Render each user in the list
  const renderUser = ({ item }) => (
    <TouchableOpacity onPress={() => handleUserPress(item)}>
      <View style={styles.userItem}>
        <Avatar size={55} img={item.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.infoText}>
            {item.phoneNumber || "Phone Number not available"}
          </Text>
          <Text style={styles.infoText}>
            {item.address || "Address not available"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Users Search" />

        <View style={styles.inputContainer}>
          <Input
            icon={<UserRoundSearch size={24} color={colorStyle.textLight} />}
            placeholder="Search for users..."
            onChangeText={(text) => setSearch(text)}
          />
        </View>

        <View style={styles.searchResults}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Search Results
          </Text>
        </View>

        <FlatList
          data={filteredData} // Display the filtered users
          keyExtractor={(item) => item.id} // Use the user's id as the key
          renderItem={renderUser} // Render the user items
          ListEmptyComponent={<Text>No users found</Text>} // Show a message when no users match
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: "#ccc" }} />
          )}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: wp(4),
  },
  inputContainer: {
    marginTop: hp(2),
  },
  searchResults: {
    marginTop: hp(2),
  },
  userItem: {
    paddingVertical: hp(1.5),
    marginBottom: hp(2),
    flexDirection: "row",
  },
  userName: {
    fontSize: hp(2),
    fontWeight: fonts.semiBold,
  },
  infoText: {
    fontSize: hp(1.6),
    fontWeight: "500",
    color: colorStyle.textLight,
  },
  infoContainer: {
    marginLeft: wp(4),
    justifyContent: "center",
  },
});
