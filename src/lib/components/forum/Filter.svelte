<script lang="ts">
    let { changeOrder } = $props();
    
    let selected = $state("desc")

    $effect(() => {
        changeOrder(selected)
    })
</script>


<div class="flex items-center gap-4">
    <label for="postFilter" class="text-xl">Filters:</label>

    <select name="postFilter" id="postFilter" class="border-muted p-2" bind:value={selected}>
        <option value="desc" class="bg-base">Newest</option>
        <option value="asc" class="bg-base">Oldest</option>
    </select>
</div>