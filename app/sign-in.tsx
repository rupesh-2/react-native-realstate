import {View, Text, ScrollView, Image ,TouchableOpacity , Alert} from 'react-native'
import React from 'react'
import images from "@/constants/images";
import {SafeAreaView} from 'react-native-safe-area-context';
import icons from "@/constants/icons";
import {login} from "@/lib/appwrite";
import {tls} from "node-forge";
import {useGlobalContext} from "@/lib/global-provide";
import {Redirect} from "expo-router";

const SignIn = () => {
    const {refetch , loading , isLogged} = useGlobalContext();
    if (!loading && isLogged) return <Redirect href="/" />
    const handleLogin =  async () => {
        const result = await login();
        if (result) {
            console.log('login successful');
        }else {
            Alert.alert('Error Login','Failed Login');
        }
    }
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
                    <Text className="text-3xl text-center  font-rubik-bold text-black-300">
                        Let's get you Closer to {"\n"}
                        <Text className="text-primary-300">Your Ideal Home</Text>
                    </Text>
                    <Text className="text-lg font-rubik text-black-200  mt-12 text-center">Login to ReState with google</Text>
                    <TouchableOpacity onPress={handleLogin} className="bg-white shadow-md  shadow-zinc-300 rounded-full w-full py-3 mt-4">
                       <View className="flex flex-row  items-center justify-center py-4">
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
    )
}
export default SignIn
