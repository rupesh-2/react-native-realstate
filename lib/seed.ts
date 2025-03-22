import { ID } from "react-native-appwrite";
import { databases, config } from "./appwrite";
import {
    agentImages,
    galleryImages,
    propertiesImages,
    reviewImages,
} from "./data";

const COLLECTIONS = {
    AGENT: config.agentsCollectionId,
    REVIEWS: config.reviewsCollectionId,
    GALLERY: config.galleriesCollectionId,
    PROPERTY: config.propertiesCollectionId,
};

const propertyTypes = [
    "House",
    "Townhouse",
    "Condo",
    "Duplex",
    "Studio",
    "Villa",
    "Apartment",
    "Others",
];

// Helper function to get a random subset from an array
function getRandomSubset<T>(array: T[], minItems: number, maxItems: number): T[] {
    if (minItems < 1) minItems = 1; // Ensure at least one item
    if (maxItems > array.length) maxItems = array.length; // Limit maxItems to array length
    if (minItems > maxItems) {
        throw new Error("minItems cannot be greater than maxItems");
    }

    const subsetSize =
        Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems;

    const arrayCopy = [...array];

    for (let i = arrayCopy.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [arrayCopy[i], arrayCopy[randomIndex]] = [
            arrayCopy[randomIndex],
            arrayCopy[i],
        ];
    }

    return arrayCopy.slice(0, subsetSize);
}

// Helper function to delete all documents from a collection
async function deleteAllDocuments(collectionId: string) {
    try {
        let hasMore = true;
        let cursor: string | undefined = undefined;

        while (hasMore) {
            const documents = await databases.listDocuments(
                config.databaseId!,
                collectionId,
                [], // No query, get all documents
                50, // Limit to 50 documents per request (default max)
                cursor
            );

            for (const doc of documents.documents) {
                await databases.deleteDocument(
                    config.databaseId!,
                    collectionId,
                    doc.$id
                );
            }

            cursor = documents.cursor; // Update cursor for pagination
            hasMore = documents.cursor !== undefined; // Continue if there are more documents
        }

        console.log(`Cleared all data in collection ${collectionId}.`);
    } catch (error) {
        console.error(`Error clearing collection ${collectionId}:`, error);
    }
}

// Main seeding function
async function seed() {
    try {
        // Clear existing data from all collections
        for (const key in COLLECTIONS) {
            const collectionId = COLLECTIONS[key as keyof typeof COLLECTIONS];
            await deleteAllDocuments(collectionId!); // Clear each collection
        }

        console.log("Cleared all existing data.");

        // Seed Agents
        const agents = [];
        for (let i = 1; i <= 5; i++) {
            try {
                const agent = await databases.createDocument(
                    config.databaseId!,
                    COLLECTIONS.AGENT!,
                    ID.unique(),
                    {
                        name: `Agent ${i}`,
                        email: `agent${i}@example.com`,
                        avatar: agentImages[Math.floor(Math.random() * agentImages.length)],
                    }
                );
                agents.push(agent);
            } catch (error) {
                console.error(`Error seeding agent ${i}:`, error);
            }
        }
        console.log(`Seeded ${agents.length} agents.`);

        // Seed Reviews
        const reviews = [];
        for (let i = 1; i <= 20; i++) {
            try {
                const review = await databases.createDocument(
                    config.databaseId!,
                    COLLECTIONS.REVIEWS!,
                    ID.unique(),
                    {
                        name: `Reviewer ${i}`,
                        avatar: reviewImages[Math.floor(Math.random() * reviewImages.length)],
                        review: `This is a review by Reviewer ${i}.`,
                        rating: Math.floor(Math.random() * 5) + 1, // Rating between 1 and 5
                    }
                );
                reviews.push(review);
            } catch (error) {
                console.error(`Error seeding review ${i}:`, error);
            }
        }
        console.log(`Seeded ${reviews.length} reviews.`);

        // Seed Galleries
        const galleries = [];
        for (const image of galleryImages) {
            try {
                const gallery = await databases.createDocument(
                    config.databaseId!,
                    COLLECTIONS.GALLERY!,
                    ID.unique(),
                    { image }
                );
                galleries.push(gallery);
            } catch (error) {
                console.error(`Error seeding gallery image:`, error);
            }
        }

        console.log(`Seeded ${galleries.length} galleries.`);

        // Seed Properties
        const numberOfProperties = 20; // Can be dynamically set or passed as a parameter
        for (let i = 1; i <= numberOfProperties; i++) {
            try {
                const assignedAgent = agents[Math.floor(Math.random() * agents.length)];
                const assignedReviews = getRandomSubset(reviews, 5, 7); // 5 to 7 reviews
                const assignedGalleries = getRandomSubset(galleries, 3, 8); // 3 to 8 galleries

                const image =
                    propertiesImages.length - 1 >= i
                        ? propertiesImages[i]
                        : propertiesImages[
                            Math.floor(Math.random() * propertiesImages.length)
                            ];

                const property = await databases.createDocument(
                    config.databaseId!,
                    COLLECTIONS.PROPERTY!,
                    ID.unique(),
                    {
                        name: `Property ${i}`,
                        type: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
                        description: `This is the description for Property ${i}.`,
                        address: `123 Property Street, City ${i}`,
                        geolocation: `192.168.1.${i}, 192.168.1.${i}`,
                        price: Math.floor(Math.random() * 9000) + 1000,
                        area: Math.floor(Math.random() * 3000) + 500,
                        bedrooms: Math.floor(Math.random() * 5) + 1,
                        bathrooms: Math.floor(Math.random() * 5) + 1,
                        rating: Math.floor(Math.random() * 5) + 1,
                        image: image,
                        agent: assignedAgent.$id,
                        reviews: assignedReviews.map((review: { $id: any }) => ({ $id: review.$id })),
                        gallery: assignedGalleries.map((gallery: { $id: any }) => ({ $id: gallery.$id })),
                    }
                );

                console.log(`Seeded property: ${property.name}`);
            } catch (error) {
                console.error(`Error seeding property ${i}:`, error);
            }
        }

        console.log("Data seeding completed.");
    } catch (error) {
        console.error("Error seeding data:", error);
    }
}

export default seed;
