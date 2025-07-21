import { DrizzleDB } from '$lib/Drizzle.ts';
import { category } from '../schemas/Category.ts';

export const CategorySeed = async () => {
	const payload = [
		{
			id: 'e5e7f797-6e83-4d18-b4cd-90328b3d9c8c',
			category: 'npcs'
		},
		{
			id: 'cbc415b1-2c59-41c2-a22a-84fd5fb1f6e3',
			category: 'enemies'
		},
		{
			id: '23ed49d7-6db4-4f6d-ae3e-1595c0b01d77',
			category: 'weapons'
		},
		{
			id: '77d2ac1e-3f23-4bda-baf7-3db9db349b3f',
			category: 'lore'
		},
		{
			id: '76075948-e9cd-420a-b849-099420d6cef5',
			category: 'classes'
		},
		{
			id: '082bc7a0-aa77-4dca-870a-f34d0ddf6e67',
			category: 'races'
		},
		{
			id: '45b87994-5d30-491e-80b9-120dc72d8586',
			category: 'magic'
		},
		{
			id: '14f22949-0e39-4043-b300-e9cd1247a4f3',
			category: 'towns'
		},
		{
			id: '51c9b6a6-03b4-4f1f-8adf-8f06e120f981',
			category: 'locations'
		},
		{
			id: '3abf32ac-a55e-4817-b412-1f5e843927fb',
			category: 'items'
		},
		{
			id: '1eeef9bc-62d6-4539-8297-de9005a540f1',
			category: 'updates'
		},
		{
			id: 'a45cbece-2712-4c5e-b6e8-4bd314670850',
			category: 'announcements'
		},
		{
			id: 'cdbf7f11-9f87-4d03-9a84-1a813897f41f',
			category: 'all'
		},
	];

	let successfulSeed = true;
	for (const item of payload) {
		try {
			await DrizzleDB.insert(category)
				.values(item)
				.onConflictDoNothing({ target: category.id })
				.execute();
		} catch (error) {
			console.error(`Error seeding category ${item.category}:`, error);
			successfulSeed = false;
		}
	}

	return successfulSeed;
};
