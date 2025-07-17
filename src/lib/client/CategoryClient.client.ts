import { PUBLIC_URL } from '$env/static/public';

const CategoryClient = {

    
    /**
     * @return Gets all current categories in database.
     */
	getCategories: async () => {
		try {
			const response = await fetch(`${PUBLIC_URL}/api/categories/retrieve`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const data = await response.json();
			return data;
		} catch (error: unknown) {
			if (!error) return;
			throw new Error('Failed to get categories', { cause: error });
		}
	},

	createCategory: async () => {},

	deleteCategory: async () => {},

	updateCategory: async () => {}
};

export default CategoryClient;
