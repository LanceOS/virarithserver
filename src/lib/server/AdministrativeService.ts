import { DrizzleDB } from '$lib/Drizzle.ts';
import { user } from '$lib/schemas/authentication.ts';
import { commentReply } from '$lib/schemas/CommentReply.ts';
import { comments } from '$lib/schemas/Comments.ts';
import { posts } from '$lib/schemas/Posts.ts';
import { reports, type ReportSchema } from '$lib/schemas/Reports.ts';
import { and, eq } from 'drizzle-orm';

class AdministrativeService {
	instance: AdministrativeService | null = null;

	constructor() {
		if (this.instance) return this.instance;
		this.instance = this;
	}

	static calculateReportPoints(userCreatedAt: Date): number {
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - userCreatedAt.getTime());
		const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.44); // Average days in a month

		let points = 5; // Base points for any report

		if (diffMonths >= 24) {
			// 2 years or more
			points += 15;
			// Small scaling for every year beyond 2 years
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
	}

	/**
	 * Handles the reporting of an object (post, comment, or user).
	 * Fetches existing reports, calculates score, updates/creates report, and soft-deletes if flagged.
	 * @param db The Drizzle database instance.
	 * @param reporterUserId The ID of the user submitting the report.
	 * @param objectId The ID of the object being reported.
	 * @param objectType The type of the object being reported ('post', 'comment', 'user').
	 * @returns A promise that resolves when the reporting process is complete.
	 */
	static async reportObject(data: {
		reporterUserId: string;
		objectId: string;
		objectType: string;
	}): Promise<ReportSchema | undefined> {
		try {
			const reporter = await DrizzleDB.select().from(user).where(eq(user.id, data.reporterUserId));

			const reportPoints = this.calculateReportPoints(reporter[0].createdAt!);

			const existingReports: ReportSchema[] = await DrizzleDB.select()
				.from(reports)
				.where(and(eq(reports.objectId, data.objectId), eq(reports.objectType, data.objectType)));

			const currentReport: ReportSchema[] | undefined = existingReports;
			let newScore: number;

			if (currentReport.length > 0) {
				const initialScore: number = currentReport[currentReport.length - 1].score || 0;

				newScore = currentReport.reduce((totalScore, report) => {
					const scoreWithPoints = report.score || 0 + reportPoints;
					return totalScore + scoreWithPoints;
				}, initialScore);

				const newReport: ReportSchema = {
					userId: data.reporterUserId,
					objectId: data.objectId,
					objectType: data.objectType,
					score: newScore
				};

				if (newScore < 50) {
					await DrizzleDB.insert(reports).values(newReport);
				} else {
					if (data.objectType === 'posts') {
						await DrizzleDB.update(posts).set({ isFlagged: true, isDeleted: true });
					} else if (data.objectType === 'comment') {
						await DrizzleDB.update(comments).set({ isFlagged: true, isDeleted: true });
					} else if (data.objectType === 'commentReply') {
						await DrizzleDB.update(commentReply).set({ isFlagged: true, isDeleted: true });
					}

					await DrizzleDB.insert(reports).values(newReport);
				}
				return newReport;
			} else {
				newScore = reportPoints;
				const newReport: ReportSchema = {
					userId: data.reporterUserId,
					objectId: data.objectId,
					objectType: data.objectType,
					score: newScore
				};

				await DrizzleDB.insert(reports).values(newReport);
				return newReport;
			}
		} catch (error) {
			console.error(`Error reporting object ${data.objectId} of type ${data.objectType}:`, error);
			throw error;
		}
	}

	static async banUserAccount() {
		try {
		} catch (error) {}
	}
}

export default AdministrativeService;
