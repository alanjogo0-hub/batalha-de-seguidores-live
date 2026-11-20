import express from 'express';
import http from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';
import { ControlEvent, TikTokLiveConnection, WebcastEvent } from 'tiktok-live-connector';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });
const PORT = process.env.PORT || 3000;
const TIKTOK_USERNAME = (process.env.TIKTOK_USERNAME || 'fabio.maral93').replace(/^@/, '');
let liveState = 'starting';
const scores = new Map();
const teams = new Map();
let nextTeam = 'blue';

function broadcast(data) {
  const payload = JSON.stringify(data);
  for (const client of wss.clients) if (client.readyState === WebSocket.OPEN) client.send(payload);
}
function award(type, user, points, detail) {
  const username = String(user || 'visitante').replace(/^@/, '');
  if (!teams.has(username)) { teams.set(username, nextTeam); nextTeam = nextTeam === 'blue' ? 'red' : 'blue'; }
  const team = teams.get(username);
  const total = (scores.get(username) || 0) + points;
  scores.set(username, total);
  broadcast({ type, username, points, team, detail, total, liveState });
}
app.get('/', (_req, res) => res.json({ app: 'Batalha de Seguidores LIVE', liveState, username: TIKTOK_USERNAME }));
app.get('/health', (_req, res) => res.json({ ok: true, liveState, username: TIKTOK_USERNAME }));
wss.on('connection', socket => socket.send(JSON.stringify({ type: 'status', liveState, username: TIKTOK_USERNAME })));

const connection = new TikTokLiveConnection(TIKTOK_USERNAME, {});
connection.on(ControlEvent.ERROR, ({ info, exception }) => {
  liveState = 'error';
  broadcast({ type: 'status', liveState, message: info || exception?.message || 'Falha na conexão com a LIVE.' });
  console.error('TikTok LIVE:', info, exception);
});
connection.on(WebcastEvent.CHAT, event => award('comment', event.user?.displayId, 5, event.content || 'comentário'));
connection.on(WebcastEvent.LIKE, event => {
  const likes = Math.max(1, Number(event.likeCount || 1));
  award('like', event.user?.displayId, Math.min(likes, 100), likes + ' curtida(s)');
});
connection.on(WebcastEvent.GIFT, event => {
  const giftName = event.giftDetails?.giftName || event.giftName || 'presente';
  const repeat = Math.max(1, Number(event.repeatCount || 1));
  if (event.repeatEnd === false) return;
  award('gift', event.user?.displayId, 20 * Math.min(repeat, 10), giftName + ' x' + repeat);
});
try {
  await connection.connect();
  liveState = 'connected';
  broadcast({ type: 'status', liveState, username: TIKTOK_USERNAME });
  console.log('Conectado à LIVE de @' + TIKTOK_USERNAME);
} catch (error) {
  liveState = 'offline';
  broadcast({ type: 'status', liveState, username: TIKTOK_USERNAME, message: error?.message || 'LIVE offline ou indisponível.' });
  console.error('Não foi possível conectar à LIVE:', error);
}
server.listen(PORT, '0.0.0.0', () => console.log('Servidor ativo na porta ' + PORT));
