<svelte:head>
	<title>Weather</title>
</svelte:head>

<script lang="ts">
	import {page} from '$app/stores';
	import {goto} from '$app/navigation';
	import {onMount} from 'svelte';
	import {getStationByAddress} from '$lib/api';
	import {getWeatherByStation} from '$lib/data';
  import Loading from '$lib/components/loading.svelte';
	import Card from '$lib/components/card.svelte';
	import type {Station} from '$lib/types';

	let address: string | undefined;
	let station: Station | undefined;
	$: stationPromise = getStationByAddress(address);
	$: stationPromise.then((result: Station|undefined) => {station = result})
	$: weatherDataPromise = station ? getWeatherByStation(station) : null;

	onMount(async () => {
		address = $page.url.searchParams.get('address') ?? '';
		if (!address) {
			goto('/');
		}
	});
</script>

<h2 class="text-xl">Weather for <span class="font-bold">{address}</span></h2>
<a href="/" class="underline">Change location</a>
{#await stationPromise}
	<Loading />
{:then station}
	{#if !station}
		<p class="p-8">Sorry, no weather station was found for your selected location (only US locations are supported)! Try selecting another place.</p>
	{:else}
		<h3 class="text-base-300">Gathering weather data from Station at <span class="font-bold">{station.name}</span></h3>

		{#if weatherDataPromise}
			{#await weatherDataPromise}
				<Loading />
			{:then weatherData}
				<div class="grid grid-cols-7 p-8 gap-4 text-lg font-bold">
					<div>Sunday</div>
					<div>Monday</div>
					<div>Tuesday</div>
					<div>Wednesday</div>
					<div>Thursday</div>
					<div>Friday</div>
					<div>Saturday</div>
					{#each weatherData as weatherDatum}
						<Card {weatherDatum} />
					{/each}
				</div>
			{:catch error}
				<p class="text-lg text-red-700">{error.message}</p>
			{/await}
		{/if}
	{/if}
{:catch error}
	<p class="text-lg text-red-700">{error.message}</p>
{/await}
