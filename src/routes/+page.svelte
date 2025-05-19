<script>
    import Header from "$lib/components/Header.svelte";
</script>

<Header />
<main class="flex flex-col">
    <section class="min-h-[30rem] h-fit relative overflow-hidden flex items-center">
        <img src="/images/green.png" alt="" class="absolute object-center -z-10 blur-sm inset-0">

        <div class="max-w-7xl w-full mx-auto px-4 flex justify-center">
            <img src="/images/.png" alt="" class="w-[45rem]">
        </div>
    </section>

    <div class="flex flex-warp gap-6 max-w-7xl mx-auto px-4">
        <!-- This is for active players -->
        <section class="border-2 flex flex-col w-full">

        </section>

        <!-- This is going to be for server questions -->
        <section class="border-2 flex flex-col w-full">
            
        </section>

        <!-- This is going to be for links and updates -->
        <section class="flex flex-col gap-4 w-full">
            <div class="border-2 flex flex-col gap-2 w-full">
                <h3>Server Disord:</h3>
            </div>

            <div class="border-2 flex flex-col gap-2">

            </div>
        </section>
    </div>
</main>