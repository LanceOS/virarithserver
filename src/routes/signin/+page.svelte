<script>
	import { goto } from "$app/navigation";


    let credentials = $state({
        email: "",
        password: ""
    });



</script>


<main class="min-h-screen w-full flex">
    <section class="w-full">
        <img src="/images/snow.png" alt="" class="object-cover w-full h-full">
    </section>

    <section class="px-4 w-3/4 flex items-center justify-center" data-aos="fade-in">
        <div class="flex flex-col gap-10 w-[25rem]">
            <h1 class="text-4xl">Signin</h1>

            <div class="flex flex-col gap-8">
                <div class="input">
                    <label for="email" class="font-bold text-lg">Email <span class="color-error">*</span></label>
                    <input type="text" name="email" id="email" class="focus:outline-0" bind:value={credentials.email}>
                </div>
    
                <div class="input">
                    <label for="password" class="font-bold text-lg">Password <span class="color-error">*</span></label>
                    <input type="text" name="password" id="password" class="focus:outline-0" bind:value={credentials.password}>
                </div>
            </div>

            <div class="flex flex-col gap-4">
                <button type="button" class="btn-big">Signin</button>
                <p>No account? Sign up for a new one <button aria-label="Signup" class="text-blue-500 hover:text-blue-900 duration-200 cursor-pointer" onclick={() => goto("/signup")}>here.</button></p>
            </div>
        </div>
    </section>
</main>