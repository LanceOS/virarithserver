<script>
    import Header from "$lib/components/Header.svelte";
</script>

<Header />
<main class="flex flex-col">
    <section class="min-h-[30rem] h-fit relative overflow-hidden flex items-center">
        <img src="/images/green.png" alt="" class="absolute object-center -z-10 blur-sm inset-0">

        <div class="max-w-7xl w-full mx-auto px-4 flex flex-col">
            <h1 class="text-7xl">Virarith MC</h1>
        </div>
    </section>

    <div class="flex flex-warp gap-4 max-w-7xl mx-auto px-4">
        <!-- This is for active players -->
        <section class="border-2 flex flex-col w-full">

        </section>

        <!-- This is going to be for server updates -->
        <section class="border-2 flex flex-col w-full">
            
        </section>

        <!-- This is going to be for links -->
        <section class="border-2 flex flex-col w-full">
         
        </section>
    </div>
</main>