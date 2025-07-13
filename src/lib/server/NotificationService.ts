import { DrizzleDB } from "$lib/Drizzle.ts";
import { notifications, type NotificationSchema } from "$lib/schemas/Notifications.ts";
import { and, eq } from "drizzle-orm";


interface INotification {
    objectId: string;
    objectType: string;
    receiverId: string;
    senderId: string;
}



class NotificationService {
    interface: NotificationService | null = null;

    constructor() {
        if(this.interface) return this.interface;
        this.interface = this;
    }
    static async generateUserNotification(object: INotification): Promise<NotificationSchema> {
        try {
            if (!object.senderId || !object.receiverId || !object.objectId) {
                throw new Error(`Missing required data to create new notification: ${object}`)
            }
            
            const response = await DrizzleDB.insert(notifications)
                .values({
                    senderId: object.senderId,
                    receiverId: object.receiverId,
                    objectId: object.objectId,
                    objectType: object.objectType
                })
                .returning();

            if (!response) {
                throw new Error(`Failed to create new user notification: ${response} with notification data: ${object}`)
            }

            return response[0]
        }
        catch (error) {
            console.error(`Failed to create new notification: ${error} due to ${object}`);
            throw new Error(`Failed to create new notification: ${error}`)
        }

    }

    static async removeUserNotification(object: INotification): Promise<boolean> {
        try {

            await DrizzleDB.delete(notifications)
                .where(and(eq(notifications.objectId, object.objectId), eq(notifications.objectType, object.objectType), eq(notifications.senderId, object.senderId)))

            return true;
        }
        catch (error) {
            throw new Error(`Failed to remove user notification: ${error}`)
        }
    }

    static async getUserNotification(userId: string) {
        try {

            if (!userId) {
                throw new Error(`Failed to get user Id required for receiving notifications: ${userId}`)
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
            console.error(`Failed to retrieve user notifications: ${error}`)
        }
    }
}

export default NotificationService;