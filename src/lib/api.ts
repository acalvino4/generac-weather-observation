import {ResponseFormatError} from '$lib/errors/response-format-error';
import {TooManyRequestsError} from '$lib/errors/too-many-requests-error';
import type {
	Location,
	Station,
	Observation,
	SuggestionResponse,
	AddressResponse,
	StationUrlResponse,
	StationsResponse,
	ObservationsResponse,
} from '$lib/types';
// Yes, this will be included in public build files! If architecting for a real application I would architect the application so this key is used server side. I elected to do it this way so I could deploy to static hosting for easy demonstration.
import {PUBLIC_ARCGIS_API_KEY} from '$env/static/public';

const baseUrlArcgis =
	'https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer';
const baseUrlNws = 'https://api.weather.gov';

/**
 * Set's the app's suggestion list based on a search query
 * @param event The event that triggers this function
 * @returns a list of up to 5 strings that match the query
 * @throws TooManyRequestsError
 * @throws ResponseFormatError
 */
export async function getAddressSuggestions(
	suggestionQuery: string,
): Promise<string[]> {
	if (!suggestionQuery) return [];
	const requestUrl = `${baseUrlArcgis}/suggest?text=${suggestionQuery}&f=json&token=${PUBLIC_ARCGIS_API_KEY}`;
	const response = await fetch(requestUrl);
	if (response.status === 429) {
		throw new TooManyRequestsError();
	}

	try {
		const {suggestions} = (await response.json()) as SuggestionResponse;
		const simplifiedSuggestions = suggestions.map(
			(suggestion) => suggestion.text,
		);
		return simplifiedSuggestions;
	} catch {
		throw new ResponseFormatError();
	}
}

/**
 * Given an address, returns the coordinates.
 * @param address An address string; will be normalized appropriately if it comes from the suggestions api
 * @returns A location object containing the coordinates of the given address, or undefined if there are no results.
 * @throws TooManyRequestsError
 * @throws ResponseFormatError
 */
export async function getAddressCoordinates(
	address: string | undefined,
): Promise<Location | undefined> {
	if (!address) return;
	const requestUrl = `${baseUrlArcgis}/findAddressCandidates?address=${address}&f=json&token=${PUBLIC_ARCGIS_API_KEY}`;
	const response = await fetch(requestUrl);
	if (response.status === 429) {
		throw new TooManyRequestsError();
	}

	try {
		const {candidates} = (await response.json()) as AddressResponse;
		// If no candidates, return nothing
		if (!candidates) return;
		// Candidates are sorted by a match score, so the first match will be the best.
		// In the event that there are multiple highest matches tied, we go with the first option.
		// For a real life app, I would gather more feedback on what the appropriate behavior here is.
		return candidates[0].location;
	} catch {
		throw new ResponseFormatError();
	}
}

/**
 * Given a location object (contains lat and long coordinates), returns a url to query nearby stations.
 * Unfortunately /points/{point}/station is deprecated, so we need to get the stations url and then query that separately
 * @param location An object containing the latitude and longtitude
 * @returns The url to query for stations near this location
 * @throws TooManyRequestsError
 * @throws ResponseFormatError
 */
export async function getStationUrl(location: Location): Promise<string> {
	// For some reason the lat and long must be entered in opposite order of what the api documentation says
	const requestUrl = `${baseUrlNws}/points/${location.y},${location.x}`;
	const response = await fetch(requestUrl);
	if (response.status === 429) {
		throw new TooManyRequestsError();
	}

	try {
		const {
			properties: {observationStations},
		} = (await response.json()) as StationUrlResponse;
		return observationStations;
	} catch {
		throw new ResponseFormatError();
	}
}

/**
 * Returns basic info for the nearest station to the given point.
 * @param url A url returned by `getStationUrl`
 * @returns Info about the nearest station
 * @throws TooManyRequestsError
 * @throws ResponseFormatError
 */
export async function getNearestStation(
	url: string,
): Promise<Station | undefined> {
	const response = await fetch(url);
	if (response.status === 429) {
		throw new TooManyRequestsError();
	}

	try {
		const {features} = (await response.json()) as StationsResponse;
		if (features.length === 0) return;
		// It seems that the first 'feature' is the closest station to our point of interest, but I haven't found documentation to confirm.
		// For a real-life project, if I couldn't verify this to be true, I would write a function to calculate distances and return the closest station based on that.
		const stationRaw = features[0];
		const station: Station = {
			name: stationRaw.properties.name,
			stationIdentifier: stationRaw.properties.stationIdentifier,
			location: {
				x: stationRaw.geometry.coordinates[0],
				y: stationRaw.geometry.coordinates[1],
			},
			timezone: stationRaw.properties.timezone,
		};
		return station;
	} catch {
		throw new ResponseFormatError();
	}
}

/**
 * Retrieves recent timestamped tempurature readings from the given station.
 * @param station The station from which to query observations.
 * @returns An array of timestamped temperature readings.
 * @throws TooManyRequestsError
 * @throws ResponseFormatError
 */
export async function getObservations(
	station: Station,
): Promise<Observation[]> {
	const requestUrl = `${baseUrlNws}/stations/${station.stationIdentifier}/observations`;
	const response = await fetch(requestUrl);
	if (response.status === 429) {
		throw new TooManyRequestsError();
	}

	try {
		const {features} = (await response.json()) as ObservationsResponse;
		const observations = features.map((feature) => ({
			timestamp: feature.properties.timestamp,
			temp: feature.properties.temperature.value,
		}));
		return observations;
	} catch {
		throw new ResponseFormatError();
	}
}

export async function getStationByAddress(
	address: string | undefined,
): Promise<Station | undefined> {
	const coordinates = await getAddressCoordinates(address);
	if (!coordinates) return;
	const stationUrl = await getStationUrl(coordinates);
	const station = await getNearestStation(stationUrl);
	return station;
}
