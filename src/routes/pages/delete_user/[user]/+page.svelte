<script lang="ts">
</script>

<main class="mx-auto flex h-screen max-w-4xl items-center justify-center px-4">
	<div class="card-setup h-fit w-full p-4 space-y-18 text-center">
		<div class="text-center space-y-4">
			<h1 class="text-error text-3xl font-semibold">DELETE ACCOUNT</h1>
			<p class="muted text-xl">
				Heads up! You're about to permanently delete your account. Your personal information will be
				removed, but your content (posts, comments, etc.) will stay on the platform, attributed to
				an anonymous user. This action is irreversible. If you're certain, click 'Confirm Delete'.
			</p>
		</div>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button type="button" class="btn-delete">CONFIRM DELETE</button>
            <a href="/" class="btn-small">CANCEL DELETE</a>
        </div>
	</div>
</main>
