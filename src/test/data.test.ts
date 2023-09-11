import {describe, expect, it} from 'vitest';
import observations from './data.json';
import {getFormattedObservations} from '$lib/data';

describe('Formatting observation data', () => {
	it('should shift the timestamp by a day when switching enough timezones', () => {
		const timezone = 'America/Denver';
		const testData = observations.slice(0, 7); // A selection of observations from Sept 11, UTC
		const weather = getFormattedObservations(testData, timezone);

		// These data points should all be converted to Sept 10
		expect(weather[0].readableDate).toBe('Sep 10, 2023');
		expect(weather[0].temps.length === 7);
	});

	it('should shift only the timestamps with time less than the number hours difference to UTC', () => {
		const timezone = 'America/New_York'; // Only shifting by 4 hours this time
		const testData = observations.slice(0, 7); // A selection of observations from Sept 11, UTC
		const weather = getFormattedObservations(testData, timezone);

		// 5 of these data points should all be converted to Sept 10; the other two should remain Sept 11
		expect(weather[0].readableDate).toBe('Sep 10, 2023');
		expect(weather[0].temps.length).toBe(5);
		expect(weather[1].readableDate).toBe('Sep 11, 2023');
		expect(weather[1].temps.length).toBe(2);
	});

	it('should select the correct daily high and low', () => {
		const timezone = 'America/New_York';
		const testData = observations.slice(0, 37); // The selection of observations from Denver on Sept 10
		const weather = getFormattedObservations(testData, timezone);

		expect(weather[0].high).toBe(18);
		expect(weather[0].low).toBe(13);
	});
});
