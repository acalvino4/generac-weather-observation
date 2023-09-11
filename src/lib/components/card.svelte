<script lang="ts">
  import type {DayOfWeather} from "$lib/types";

	export let weatherDatum: DayOfWeather;
</script>

<div class="card bg-base-200 shadow-xl" style="grid-column-start: {weatherDatum.dayOfWeek}">
	<div class="card-body">
		<h2 class="card-title">{weatherDatum.readableDate}</h2>
		<p class="font-bold text-lg"><span class="text-red-700">{weatherDatum.high}&nbsp;&deg;C</span> / <span class="text-blue-500">{weatherDatum.low}&nbsp&deg;C</span></p>
	</div>
</div>
