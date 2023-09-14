import {writable} from 'svelte/store';
import type {Writable} from 'svelte/store';

export type TemperatureScale = 'C' | 'F';
export const temperatureScale: Writable<TemperatureScale> = writable('C');
