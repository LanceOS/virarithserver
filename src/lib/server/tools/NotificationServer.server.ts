import { DrizzleDB } from "$lib/Drizzle.ts";
import { notifications, type NotificationSchema } from "$lib/server/schemas/Notifications.ts";
import { and, eq } from "drizzle-orm";


interface INotification {
    objectId: string;
    objectType: string;
    receiverId: string;
    senderId: string;
}

const NotificationService = {
    /**
     * Generates and stores a new user notification in the database.
     *
     * @param object An object containing details for the notification: `objectId`, `objectType`, `receiverId`, `senderId`.
     * @returns A Promise that resolves to the created `NotificationSchema` object.
     * @throws {Error} If required data is missing or if the notification creation fails.
     */
    generateUserNotification: async (object: INotification): Promise<NotificationSchema> => {
        try {
            if (!object.senderId || !object.receiverId || !object.objectId) {
                throw new Error(`Missing required data to create new notification: ${JSON.stringify(object)}`);
            }

            const response = await DrizzleDB.insert(notifications)
                .values({
                    senderId: object.senderId,
                    receiverId: object.receiverId,
                    objectId: object.objectId,
                    objectType: object.objectType
                })
                .returning();

            if (!response || response.length === 0) {
                throw new Error(`Failed to create new user notification. DrizzleDB response was empty or null for data: ${JSON.stringify(object)}`);
            }

            return response[0];
        }
        catch (error) {
            console.error(`Failed to create new notification for object: ${JSON.stringify(object)}. Error:`, error);
            throw new Error(`Failed to create new notification.`, { cause: error });
        }
    },

    /**
     * Removes a user notification from the database based on object details.
     *
     * @param object An object containing details to identify the notification: `objectId`, `objectType`, `senderId`.
     * @returns A Promise that resolves to `true` if the notification is successfully removed.
     * @throws {Error} If the notification removal fails.
     */
    removeUserNotification: async (object: INotification): Promise<boolean> => {
        try {
            await DrizzleDB.delete(notifications)
                .where(and(
                    eq(notifications.objectId, object.objectId),
                    eq(notifications.objectType, object.objectType),
                    eq(notifications.senderId, object.senderId)
                ));

            return true;
        }
        catch (error) {
            console.error(`Failed to remove user notification for object: ${JSON.stringify(object)}. Error:`, error);
            throw new Error(`Failed to remove user notification.`, { cause: error });
        }
    },

    /**
     * Retrieves all notifications for a specific user.
     *
     * @param userId The ID of the user whose notifications are to be retrieved.
     * @returns A Promise that resolves to an array of `NotificationSchema` objects, including sender details.
     * @throws {Error} If the `userId` is missing or if the retrieval of notifications fails.
     */
    getUserNotification: async (userId: string) => {
        try {
            if (!userId) {
                throw new Error(`Failed to get user ID required for receiving notifications. Provided userId: ${userId}`);
            }

            const response = await DrizzleDB.query.notifications.findMany({
                where: and(eq(notifications.receiverId, userId), eq(notifications.type, "notification")),
                with: {
                    sender: true 
                }
            });

            return response;
        }
        catch (error) {
            console.error(`Failed to retrieve user notifications for userId: ${userId}. Error:`, error);
            throw new Error(`Failed to retrieve user notifications.`, { cause: error });
        }
    }
};

export default NotificationService;