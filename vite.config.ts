import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function saveCustomContentPlugin(): Plugin {
  return {
    name: 'save-custom-content-endpoint',
    configureServer(server) {
      server.middlewares.use('/api/save-custom-content', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', () => {
          try {
            const payload = JSON.parse(body);
            const { bestFriendName, heroPhoto, memories } = payload;
            const photosDir = path.resolve(__dirname, 'public/photos');
            if (!fs.existsSync(photosDir)) {
              fs.mkdirSync(photosDir, { recursive: true });
            }

            let savedHeroPath = '';
            if (heroPhoto && typeof heroPhoto === 'string' && heroPhoto.startsWith('data:image/')) {
              const match = heroPhoto.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
              if (match) {
                const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
                const buffer = Buffer.from(match[2], 'base64');
                fs.writeFileSync(path.join(photosDir, `hero.${ext}`), buffer);
                if (ext !== 'jpg') {
                  fs.writeFileSync(path.join(photosDir, 'hero.jpg'), buffer);
                }
                savedHeroPath = 'photos/hero.jpg';
              }
            }

            const updatedMemories: any[] = [];
            if (Array.isArray(memories)) {
              memories.forEach((mem, idx) => {
                let imgPath = mem.image;
                if (typeof mem.image === 'string' && mem.image.startsWith('data:image/')) {
                  const match = mem.image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
                  if (match) {
                    const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
                    const buffer = Buffer.from(match[2], 'base64');
                    fs.writeFileSync(path.join(photosDir, `photo${idx + 1}.${ext}`), buffer);
                    if (ext !== 'jpg') {
                      fs.writeFileSync(path.join(photosDir, `photo${idx + 1}.jpg`), buffer);
                    }
                    imgPath = `photos/photo${idx + 1}.jpg`;
                  }
                }

                updatedMemories.push({
                  id: mem.id || `mem-${idx + 1}`,
                  image: imgPath,
                  fallbackImage: imgPath,
                  caption: mem.caption || `Memory with ${bestFriendName || 'Sailu'} 💗`,
                  date: mem.date || 'Special Moment',
                  tag: mem.tag || 'Special Memory',
                  rotation: typeof mem.rotation === 'number' ? mem.rotation : (idx % 2 === 0 ? -2.5 : 2.5)
                });
              });
            }

            // Write src/customData.json
            const customDataPath = path.resolve(__dirname, 'src/customData.json');
            const dataToSave = {
              bestFriendName: bestFriendName || 'Sailu',
              heroPhoto: savedHeroPath || '',
              memories: updatedMemories
            };
            fs.writeFileSync(customDataPath, JSON.stringify(dataToSave, null, 2), 'utf-8');

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, count: updatedMemories.length }));
          } catch (err: any) {
            console.error('Error saving custom content:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err?.message || 'Server error' }));
          }
        });
      });
    }
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), saveCustomContentPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
