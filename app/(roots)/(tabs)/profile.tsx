import {View, Text, ScrollView, Image} from 'react-native'
import React from 'react'
import {logout} from "@/lib/appwrite";
import {SafeAreaView} from "react-native-safe-area-context";
import icons from "@/constants/icons";

const Profile = async () => {
    const hanleLogout = async () => {
    };
    return (
        <SafeAreaView className="h-full bg-white">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-32 px-7l">
                <View className="flex flex-row  justify-between items-center mt-5">
                         <Text className="text-xl font-rubik-bold">
                              Profile
                           </Text>
                               <Image source={icons.bell} className="w-2 h-2" />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
export default Profile
