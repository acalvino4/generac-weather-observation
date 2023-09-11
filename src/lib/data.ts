import {DateTime} from 'luxon';
import type {Observation, DayOfWeather, Station} from '$lib/types';
import {getObservations} from '$lib/api';

/**
 * A helper function to get formatted data directly from station (from an end-user perspective), for cleaner templates.
 * @param station The station to query from
 * @returns Structured weather data for use in templates
 */
export async function getWeatherByStation(
	station: Station,
): Promise<DayOfWeather[]> {
	const observations = await getObservations(station);
	console.log(observations);
	const weatherByDay = getFormattedObservations(observations, station.timezone);
	return weatherByDay;
}

/**
 * Process observation data into easily consumable format
 * @param observations An array of observation data as returned by `getObservations`
 * @param timezone The station's timezone
 * @returns
 */
export function getFormattedObservations(
	observations: Observation[],
	timezone: string,
): DayOfWeather[] {
	const weatherByDay: Record<string, DayOfWeather> = {};
	for (const observation of observations) {
		// Timestamps all come in as UTC. Obviously a user doesn't want weather data stratified by UTC, but by his local time, so we change that.
		const time = DateTime.fromISO(observation.timestamp).setZone(timezone);
		const key = Number(time.toISODate({format: 'basic'}));
		if (!(key in weatherByDay)) {
			weatherByDay[key] = {
				sortableDate: key,
				readableDate: time.toLocaleString(DateTime.DATE_MED),
				dayOfWeek: Number(time.toFormat('c')),
				temps: [],
			};
		}

		// Sometimes this is null, in which case we don't want to push the value
		if (observation.temp) weatherByDay[key].temps.push(observation.temp);
	}

	// Should be sorted already, bc observations are sorted by day; however, this isn't an api guarantee as far as I can tell.
	const sortedWeather = Object.values(weatherByDay).sort(
		(dayA, dayB) => dayA.sortableDate - dayB.sortableDate,
	);

	for (const day of sortedWeather) {
		day.high = Math.max(...day.temps);
		day.low = Math.min(...day.temps);
	}

	return sortedWeather;
}
