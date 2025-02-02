import type { Handle } from '@sveltejs/kit';
import Database from 'better-sqlite3';
import { DB_PATH } from '$env/static/private';

export const handle: Handle = async ({ event, resolve }) => {
  if (!event.locals.db) {
    const db = new Database(DB_PATH, { verbose: console.log });
    // Set the db as our events.db variable.
    event.locals.db = db
  }

  const resp = await resolve(event);
  return resp;
};