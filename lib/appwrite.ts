import {
    Client,
    Account,
    ID,
    Databases,
    OAuthProvider,
    Avatars,
    Query,
    Storage,
} from "react-native-appwrite";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";

// Configuration object with environment variables
export const config = {
    platform: "com.jsm.restate",
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
    galleriesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID!,
    reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID!,
    agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID!,
    propertiesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID!,
    bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!,
};

export const client = new Client();
client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Login function with improved error handling and flow
export async function login(): Promise<boolean> {
    try {
        const redirectUri = Linking.createURL("/");

        // Create OAuth2 token for Google login
        const response = await account.createOAuth2Token(OAuthProvider.Google, redirectUri);
        if (!response) throw new Error("OAuth2 token creation failed");

        const browserResult = await openAuthSessionAsync(response.toString(), redirectUri);
        if (browserResult.type !== "success") {
            throw new Error("OAuth2 authentication failed");
        }

        const url = new URL(browserResult.url);
        const secret = url.searchParams.get("secret");
        const userId = url.searchParams.get("userId");

        if (!secret || !userId) throw new Error("Invalid OAuth2 response parameters");

        // Create session after successful OAuth
        const session = await account.createSession(userId, secret);
        if (!session) throw new Error("Failed to create session");

        return true;
    } catch (error) {
        console.error("Login error:", error);
        return false;
    }
}

// Logout function with improved error handling
export async function logout(): Promise<boolean> {
    try {
        const result = await account.deleteSession("current");
        return result ? true : false;
    } catch (error) {
        console.error("Logout error:", error);
        return false;
    }
}

// Get current user with avatar generation
export async function getCurrentUser(): Promise<any | null> {
    try {
        const result = await account.get();
        if (result.$id) {
            const userAvatar = avatar.getInitials(result.name);
            return {
                ...result,
                avatar: userAvatar.toString(),
            };
        }
        return null;
    } catch (error) {
        console.error("Get current user error:", error);
        return null;
    }
}

// Fetch latest properties with improved error handling
export async function getLatestProperties(): Promise<any[]> {
    try {
        const result = await databases.listDocuments(
            config.databaseId,
            config.propertiesCollectionId,
            [Query.orderAsc("$createdAt"), Query.limit(5)]
        );
        return result.documents;
    } catch (error) {
        console.error("Get latest properties error:", error);
        return [];
    }
}

// Fetch properties with custom query filters and limit
export async function getProperties({
                                        filter,
                                        query,
                                        limit,
                                    }: {
    filter: string;
    query: string;
    limit?: number;
}): Promise<any[]> {
    try {
        const buildQuery = [Query.orderDesc("$createdAt")];

        if (filter && filter !== "All") {
            buildQuery.push(Query.equal("type", filter));
        }

        if (query) {
            buildQuery.push(
                Query.or([
                    Query.search("name", query),
                    Query.search("address", query),
                    Query.search("type", query),
                ])
            );
        }

        if (limit) {
            buildQuery.push(Query.limit(limit));
        }

        const result = await databases.listDocuments(
            config.databaseId,
            config.propertiesCollectionId,
            buildQuery
        );

        return result.documents;
    } catch (error) {
        console.error("Get properties error:", error);
        return [];
    }
}

// Fetch a property by its ID
export async function getPropertyById({ id }: { id: string }): Promise<any | null> {
    try {
        const result = await databases.getDocument(
            config.databaseId,
            config.propertiesCollectionId,
            id
        );
        return result;
    } catch (error) {
        console.error("Get property by ID error:", error);
        return null;
    }
}
