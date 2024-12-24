import { writable } from 'svelte/store';
import type { CompanySalary } from '../types/salary';

export const customSalaries = writable<CompanySalary[]>([]);
export const newestEntry = writable<string | null>(null); // Store company+position as identifier
