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