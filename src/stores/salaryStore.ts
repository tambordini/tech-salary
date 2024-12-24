import { writable } from 'svelte/store';
import type { CompanySalary } from '../types/salary';

export const customSalaries = writable<CompanySalary[]>([]);
