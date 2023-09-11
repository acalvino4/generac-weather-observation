import {writable} from 'svelte/store';

export type Location = {
	x: number;
	y: number;
};
export type Station = {
	name: string;
	stationIdentifier: string;
	location: Location;
	timezone: string;
};
export type Observation = {
	timestamp: string;
	// eslint-disable-next-line @typescript-eslint/ban-types
	temp: number | null;
};
export type DayOfWeather = {
	sortableDate: number;
	readableDate: string;
	dayOfWeek: number;
	temps: number[];
	high?: number;
	low?: number;
};

export type SuggestionResponse = {
	suggestions: Array<{
		text: string;
	}>;
};
export type AddressResponse = {
	candidates: [{location: Location}];
};
export type StationUrlResponse = {
	properties: {observationStations: string};
};
export type StationsResponse = {
	features: Array<{
		geometry: {coordinates: number[]};
		properties: {
			stationIdentifier: string;
			name: string;
			timezone: string;
		};
	}>;
};
export type ObservationsResponse = {
	features: Array<{
		properties: {
			timestamp: string;
			temperature: {
				value: number;
			};
		};
	}>;
};
