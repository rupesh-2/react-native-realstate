import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import images from "@/constants/images";
import icons from "@/constants/icons";
import { login, account } from "@/lib/appwrite"; // Ensure Appwrite's account instance is imported
import { useGlobalContext } from "@/lib/global-provide";

const SignIn = () => {
    const { refetch, loading, isLogged } = useGlobalContext();
    const router = useRouter();

    // Redirect user if already logged in
    useEffect(() => {
        if (!loading && isLogged) {
            router.replace("/"); // Redirect to home page
        }
    }, [loading, isLogged]);

    const handleLogin = async () => {
        try {
            const result = await login();
            if (!result) {
                Alert.alert("Login Error", "Failed to authenticate");
                return;
            }

            console.log("✅ Login successful", result);

            // Check if a session was created
            const user = await account.get();
            console.log("👤 User Details:", user);

            await refetch();
            router.replace("/");
        } catch (error) {
            console.error("🚨 Login Error:", error);
            Alert.alert("Login Error", error.message || "Something went wrong");
        }
    };
    return (
        <SafeAreaView className="bg-white h-full">
            <ScrollView contentContainerClassName="h-full">
                <Image
                    source={images.onboarding}
                    className="w-full h-4/6"
                    resizeMode="contain"
                />
                <View className="px-10">
                    <Text className="text-base text-center uppercase font-rubik text-black-200">
                        Welcome to ReState
                    </Text>
                    <Text className="text-3xl text-center font-rubik-bold text-black-300">
                        Let's get you Closer to {"\n"}
                        <Text className="text-primary-300">Your Ideal Home</Text>
                    </Text>
                    <Text className="text-lg font-rubik text-black-200 mt-12 text-center">
                        Login to ReState with Google
                    </Text>
                    <TouchableOpacity
                        onPress={handleLogin}
                        className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-3 mt-4"
                    >
                        <View className="flex flex-row items-center justify-center py-4">
                            <Image
                                source={icons.google}
                                className="w-5 h-5 mr-2"
                                resizeMode="contain"
                            />
                            <Text>Continue With Google</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignIn;
