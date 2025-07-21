import { CategorySeed } from './CategorySeed.seed.ts';
import { UserSeed } from './UserSeed.seed.ts';

export const Seeder = async () => {
	await UserSeed();
	await CategorySeed();
};
