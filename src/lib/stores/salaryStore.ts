import type { CompanySalary } from '$lib/types/salary';
import { writable } from 'svelte/store';

export const newestEntry = writable<string | null>(null);
export const customSalaries = writable<CompanySalary[]>([]);
