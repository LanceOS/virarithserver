<script lang="ts">
	import { authClient } from "$lib/auth-client.ts";

    export let data;
    console.log(data)
    const profile = data.profile;
    console.log(profile)
</script>

<main>
    <section class="">
        <h1>{profile.user.name}</h1>
    </section>
</main>