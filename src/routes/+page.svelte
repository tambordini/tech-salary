<script lang="ts">
	import Loading from '$lib/components/Loading.svelte';
	import { onMount } from 'svelte';

	let isLoading = true;

	onMount(() => {
		setTimeout(() => {
			isLoading = false;
		}, 1500);
	});
</script>

{#if isLoading}
	<Loading />
{:else}
	<h1>Welcome to SvelteKit</h1>
	<h2>Hello World</h2>
	<p>
		Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
	</p>
{/if}
