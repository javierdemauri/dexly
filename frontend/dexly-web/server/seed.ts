import { db, runMigrations } from './db.ts'
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';


async function main() {
runMigrations();
const id = randomUUID();
const password = 'demo1234';
const hash = await bcrypt.hash(password, 12);


const insert = db.prepare(`
INSERT INTO client (id, name, username, password_hash, mc_subdomain, mc_client_id, mc_client_secret)
VALUES (@id, @name, @username, @password_hash, @mc_subdomain, @mc_client_id, @mc_client_secret)
`);


insert.run({
id,
name: 'Cliente Demo',
username: 'demo@dexly.local',
password_hash: hash,
mc_subdomain: 'mcsubdomain-demo', // p.ej: xxzzzzzzzzzzzzzz.auth.marketingcloudapis.com → usarás 'xxzzzzzzzzzzzzzz'
mc_client_id: 'CLIENT_ID_DEMO',
mc_client_secret: 'CLIENT_SECRET_DEMO',
});


console.log('Seed ok. Usuario:', 'demo@dexly.local', 'Password:', password);
}


main();