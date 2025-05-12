<script>

    let credentials = $state({
        email: "",
        password: ""
    });

</script>


<main class="min-h-screen w-full px-4 flex justify-center items-center">
    <div class="border-2 max-w-3xl w-full p-12 flex flex-col gap-12">
        <h1 class="text-4xl">Login</h1>

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
    </div>
</main>