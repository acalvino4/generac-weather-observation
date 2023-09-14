<script lang="ts">
  import type {DayOfWeather} from '$lib/types';
	import {localizeTemperature} from '$lib/data';
	import {temperatureScale} from '$lib/store';

	$: high = localizeTemperature(weatherDatum.high, $temperatureScale);
	$: low = localizeTemperature(weatherDatum.low, $temperatureScale);

	export let weatherDatum: DayOfWeather;
</script>

<div class="card bg-base-200 shadow-xl" style="grid-column-start: {(weatherDatum.dayOfWeek+1)%7}">
	<div class="card-body">
		<h2 class="card-title">{weatherDatum.readableDate}</h2>
		<p class="font-bold text-lg"><span class="text-red-700">{high}&nbsp;&deg;{$temperatureScale}</span> / <span class="text-blue-500">{low}&nbsp&deg;{$temperatureScale}</span></p>
	</div>
</div>
