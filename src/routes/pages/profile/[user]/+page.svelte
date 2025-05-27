<script lang="ts">
	import { authClient } from "$lib/auth-client.ts";

    export let data;
    console.log(data)
    const profile = data.profile;
    console.log(profile)

    	// Props for the profile data - in a real app, you'd fetch this
	export let avatarUrl: string = 'https://via.placeholder.com/150'; // Placeholder avatar
	export let username: string = 'Username';
	export let bio: string = 'This is a sample bio. Users can write a bit about themselves here.';
</script>

<div class="profile-container">
	<div class="profile-card">
		<div class="avatar-section">
			<img src={avatarUrl} alt="{username}'s avatar" class="avatar-image" />
		</div>
		<div class="info-section">
			<h1 class="username">{username}</h1>
			<p class="bio">{bio}</p>
		</div>
	</div>
</div>

<style>
	.profile-container {
		display: flex;
		justify-content: center;
		align-items: flex-start; /* Align to top if page is scrollable */
		min-height: 80vh; /* Take up most of the viewport height */
		padding: 2rem;
		background-color: var(--color-base);
		color: var(--color-base-content);
		font-family: sans-serif;
	}

	.profile-card {
		background-color: var(--color-card);
		border: 1px solid var(--color-card-border);
		border-radius: 8px;
		padding: 2rem;
		width: 100%;
		max-width: 600px; /* Max width for the profile card */
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column; /* Stack avatar and info vertically on small screens */
		gap: 1.5rem; /* Space between avatar and info sections */
	}

	.avatar-section {
		display: flex;
		justify-content: center; /* Center avatar within its section */
		align-items: center;
	}

	.avatar-image {
		width: 120px; /* Size of the avatar */
		height: 120px;
		border-radius: 50%; /* Circular avatar */
		object-fit: cover; /* Ensure avatar image covers the area well */
		border: 3px solid var(--color-primary); /* Highlight avatar with primary color */
	}

	.info-section {
		text-align: center; /* Center text within the info section */
	}

	.username {
		font-size: 2rem; /* Larger font for username */
		font-weight: bold;
		color: var(--color-primary); /* Use primary color for username */
		margin-top: 0;
		margin-bottom: 0.5rem;
	}

	.bio {
		font-size: 1rem;
		color: var(--color-base-content);
		line-height: 1.6;
		white-space: pre-wrap; /* Preserve line breaks in bio */
		margin-bottom: 0;
	}

	/* Responsive adjustments */
	@media (min-width: 768px) {
		.profile-card {
			flex-direction: row; /* Avatar and info side-by-side on larger screens */
			align-items: flex-start; /* Align items to the start of the cross axis */
			gap: 2rem;
		}

		.avatar-section {
			justify-content: flex-start; /* Align avatar to the left on larger screens */
			flex-shrink: 0; /* Prevent avatar section from shrinking */
		}

		.avatar-image {
			width: 150px;
			height: 150px;
		}

		.info-section {
			text-align: left; /* Align text to the left on larger screens */
		}

		.username {
			font-size: 2.5rem;
		}
	}
</style>