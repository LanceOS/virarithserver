<script lang="ts">
    let { changeOrder } = $props();

    let selected = $state("desc")

    $effect(() => {
        changeOrder(selected)
    })
</script>

<div class="flex items-center gap-4">
    <label for="postFilter" class="text-xl" style="color: var(--color-base-content);">Sort By:</label>

    <select
        name="postFilter"
        id="postFilter"
        class="input cursor-pointer"
        bind:value={selected}
    >
        <option value="desc">Newest</option>
        <option value="asc">Oldest</option>
    </select>
</div>