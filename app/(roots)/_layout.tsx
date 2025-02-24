import{useGlobalContext} from "@/lib/global-provide";
import {SafeAreaView} from "react-native-safe-area-context";
import {ActivityIndicator} from "react-native";
import {Navigator, Redirect ,Slot} from "expo-router";
export default function AppLayout() {
const {loading, isLogged} = useGlobalContext();
if (loading) {
    return (
        <SafeAreaView className="bg-white h-full flex items-center justify-center">
            <ActivityIndicator className="text-primary-300" size="large"/>
        </SafeAreaView>
    );
}
    if (!isLogged) return <Redirect href="/sign-in" />
    return <Slot />

}