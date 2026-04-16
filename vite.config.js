import fs from 'node:fs/promises';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const stateDir = path.resolve(process.env.LOCALAPPDATA || process.cwd(), 'FocusStack');
const stateFile = path.join(stateDir, 'focusstack-state.json');

function focusStackStatePlugin() {
  return {
    name: 'focusstack-state-api',
    configureServer(server) {
      server.middlewares.use('/api/focusstack-state', async (req, res, next) => {
        if (req.method === 'GET') {
          try {
            const raw = await fs.readFile(stateFile, 'utf8');
            res.setHeader('Content-Type', 'application/json');
            res.end(raw);
          } catch (error) {
            if (error.code === 'ENOENT') {
              res.statusCode = 404;
              res.end();
              return;
            }

            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to read FocusStack state file.' }));
          }
          return;
        }

        if (req.method === 'POST') {
          let body = '';

          req.on('data', (chunk) => {
            body += chunk;
          });

          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body);

              if (!parsed || typeof parsed !== 'object' || !parsed.data || typeof parsed.data !== 'object') {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid FocusStack state payload.' }));
                return;
              }

              await fs.mkdir(stateDir, { recursive: true });

              try {
                const existingRaw = await fs.readFile(stateFile, 'utf8');
                const existing = JSON.parse(existingRaw);

                if (
                  typeof existing?.savedAt === 'string'
                  && typeof parsed?.savedAt === 'string'
                  && existing.savedAt > parsed.savedAt
                ) {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ ok: true, skipped: true }));
                  return;
                }
              } catch (error) {
                if (error.code !== 'ENOENT') {
                  throw error;
                }
              }

              const tempFile = `${stateFile}.tmp`;
              await fs.writeFile(tempFile, JSON.stringify(parsed, null, 2), 'utf8');
              await fs.rename(tempFile, stateFile);

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true }));
            } catch {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to write FocusStack state file.' }));
            }
          });

          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [focusStackStatePlugin(), react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
  },
});
