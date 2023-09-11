<svelte:head>
	<title>Home</title>
</svelte:head>

<script lang="ts">
	import debounce from 'debounce-promise';
	import {getAddressSuggestions} from '$lib/api';
	import Loading from '$lib/components/loading.svelte';

	const getSuggestionsDebounced = debounce(getAddressSuggestions, 500);

	let searchString = '';
	let suggestionsPromise: Promise<string[]>;
	$: suggestionsPromise = getSuggestionsDebounced(searchString);

</script>

<div class="form-control w-full max-w-xs flex flex-col items-end">
	<label class="label">
		<span class="label-text mr-4">Search for your address:</span>
		<input type="text" placeholder="Type here" class="input input-bordered input-primary w-full max-w-xs" bind:value={searchString}/>
	</label>

	{#await suggestionsPromise}
		<Loading />
	{:then suggestions}
		{#if suggestions.length}
			<ul class="menu bg-base-200 w-56 rounded-box">
				{#each suggestions as address}
					<li><a href="weather?address={address}">{address}</a></li>
				{/each}
			</ul>
		{/if}
	{:catch error}
		<p class="text-lg text-red-700">{error.message}</p>
	{/await}
</div>
