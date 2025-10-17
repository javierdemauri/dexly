import express from 'express';
import cors from 'cors';
import { db, runMigrations } from './db.ts'
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const app = express();
app.use(cors());
app.use(express.json());

runMigrations();


const LoginDTO = z.object({ username: z.string().email(), password: z.string().min(6) });


app.post('/api/login', async (req, res) => {
    const parse = LoginDTO.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ ok: false, error: 'payload inválido' });
    const { username, password } = parse.data;


    const row = db.prepare('SELECT * FROM client WHERE username = ?').get(username) as any | undefined;
    if (!row) return res.status(401).json({ ok: false, error: 'Credenciales inválidas' });


    const valid = await bcrypt.compare(password, row.password_hash);
    if (!valid) return res.status(401).json({ ok: false, error: 'Credenciales inválidas' });


    // Nunca devolvemos password_hash ni mc_client_secret en claro a frontend.
    const client = {
        id: row.id,
        name: row.name,
        username: row.username,
        mc_subdomain: row.mc_subdomain,
        mc_client_id: row.mc_client_id,
        // mc_client_secret queda sólo del lado del server
    };


    return res.json({ ok: true, client });
});


app.get('/api/health', (_req, res) => res.json({ ok: true }));


const PORT = process.env.PORT || 5174; // distinto del vite 5173
app.listen(PORT, () => console.log('API escuchando en http://localhost:' + PORT));