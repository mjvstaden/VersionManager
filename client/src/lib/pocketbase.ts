import PocketBase, { ClientResponseError } from 'pocketbase';

export const pocketbase = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

