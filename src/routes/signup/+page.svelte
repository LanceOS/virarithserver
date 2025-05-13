<script>
	import { goto } from "$app/navigation";


    let credentials = $state({
        email: "",
        password: "",
        confirmPassword: ""
    });


    
</script>


<main class="min-h-screen w-full flex">
    <section class="px-4 w-3/4 flex items-center justify-center" data-aos="fade-in">
        <div class="flex flex-col gap-10 w-[25rem]">
            <h1 class="text-4xl">Create Account</h1>

            <div class="flex flex-col gap-8">
                <div class="input">
                    <label for="email" class="font-bold text-lg">Email <span class="color-error">*</span></label>
                    <input type="text" name="email" id="email" class="focus:outline-0" bind:value={credentials.email}>
                </div>
    
                <div class="input">
                    <label for="password" class="font-bold text-lg">Password <span class="color-error">*</span></label>
                    <input type="text" name="password" id="password" class="focus:outline-0" bind:value={credentials.password}>
                </div>

                <div class="input">
                    <label for="confirm" class="font-bold text-lg">Confirm Password <span class="color-error">*</span></label>
                    <input type="text" name="confirm" id="confirm" class="focus:outline-0" bind:value={credentials.confirmPassword}>
                </div>
            </div>

            <div class="flex flex-col gap-4">
                <button type="button" class="btn-big">Create Account</button>
                <p>Have an account? Sign in <button aria-label="Signup" class="text-blue-500 hover:text-blue-900 duration-200 cursor-pointer" onclick={() => goto("/signin")}>here.</button></p>
            </div>
        </div>
    </section>
    <section class="w-full">
        <img src="/images/gray.png" alt="" class="object-cover w-full h-full">
    </section>
</main>