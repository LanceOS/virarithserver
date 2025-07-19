import { DrizzleDB } from '$lib/Drizzle.ts';
import { user } from '$lib/server/schemas/authentication.ts';
import { commentReply } from '$lib/server/schemas/CommentReply.ts';
import { comments } from '$lib/server/schemas/Comments.ts';
import { posts } from '$lib/server/schemas/Posts.ts';
import { reports, type ReportSchema } from '$lib/server/schemas/Reports.ts';
import { and, eq } from 'drizzle-orm';

const AdministrativeService = {
    /**
     * Calculates report points based on user's account creation date.
     * @param userCreatedAt The creation date of the user's account.
     * @returns The calculated report points.
     */
    calculateReportPoints: (userCreatedAt: Date): number => {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - userCreatedAt.getTime());
        const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.44); // Average days in a month

        let points = 5; // Base points for any report

        if (diffMonths >= 24) {
            // 2 years or more
            points += 15;
            const yearsBeyondTwo = Math.floor(diffMonths / 12) - 2;
            if (yearsBeyondTwo > 0) {
                points += yearsBeyondTwo * 1;
            }
        } else if (diffMonths >= 12) {
            // 1 year to less than 2 years
            points += 10;
        } else if (diffMonths >= 6) {
            points += 5;
        }
        // Users less than 6 months just get the base 5 points

        return points;
    },

    /**
     * Handles the reporting of an object (post, comment, or user).
     * Fetches existing reports, calculates score, updates/creates report, and soft-deletes if flagged.
     * @param data An object containing reporterUserId, objectId, and objectType.
     * @returns A promise that resolves with the created or updated ReportSchema, or undefined.
     */
    reportObject: async (data: {
        reporterUserId: string;
        objectId: string;
        objectType: string;
    }): Promise<ReportSchema | undefined> => {
        try {
            const reporter = await DrizzleDB.select().from(user).where(eq(user.id, data.reporterUserId));

            if (!reporter || reporter.length === 0 || !reporter[0].createdAt) {
                throw new Error('Reporter not found or creation date is missing.');
            }

            const reportPoints = AdministrativeService.calculateReportPoints(reporter[0].createdAt);

            const existingReports: ReportSchema[] = await DrizzleDB.select()
                .from(reports)
                .where(and(eq(reports.objectId, data.objectId), eq(reports.objectType, data.objectType)));

            let newScore: number;
            let newReport: ReportSchema;

            const REQUIRED_REPORT_POINTS = 0;

            if (existingReports.length > 0) {
                // Calculate the sum of all existing scores plus the new reportPoints
                const totalExistingScore = existingReports.reduce((sum, report) => sum + (report.score || 0), 0);
                newScore = totalExistingScore + reportPoints;
                

                newReport = {
                    userId: data.reporterUserId,
                    objectId: data.objectId,
                    objectType: data.objectType,
                    score: newScore
                };

                if (newScore > REQUIRED_REPORT_POINTS) {
                    if (data.objectType === 'posts') {
                        await DrizzleDB.update(posts).set({ isFlagged: true, isDeleted: true }).where(eq(posts.id, data.objectId)).execute();
                    } else if (data.objectType === 'comment') {
                        await DrizzleDB.update(comments).set({ isFlagged: true, isDeleted: true }).where(eq(comments.id, data.objectId)).execute();
                    } else if (data.objectType === 'commentReply') {
                        await DrizzleDB.update(commentReply).set({ isFlagged: true, isDeleted: true }).where(eq(commentReply.id, data.objectId)).execute();
                    }
                }

                console.debug(newReport)

                await DrizzleDB.insert(reports).values(newReport); // Always insert the new report
            } else {
                // No existing reports, so the new score is just the report points
                newScore = reportPoints;
                newReport = {
                    userId: data.reporterUserId,
                    objectId: data.objectId,
                    objectType: data.objectType,
                    score: newScore
                };
                await DrizzleDB.insert(reports).values(newReport);
            }
            return newReport;
        } catch (error) {
            console.error(`Error reporting object ${data.objectId} of type ${data.objectType}:`, error);
            throw error;
        }
    },

    // Uncomment and implement if needed
    // banUserAccount: async () => {
    //  try {
    //      // Implementation for banning a user account
    //  } catch (error) {
    //      console.error("Error banning user account:", error);
    //      throw error;
    //  }
    // }
};

export default AdministrativeService;