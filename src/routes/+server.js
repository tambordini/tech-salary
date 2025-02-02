import { json } from '@sveltejs/kit';
import Database from "better-sqlite3";
import { DB_PATH } from '$env/static/private';

const db = new Database(DB_PATH, { verbose: console.log });

export function GET() {
    const stmt = db.prepare("select * from salary");
    const rows = stmt.all();

    return json(rows);
}