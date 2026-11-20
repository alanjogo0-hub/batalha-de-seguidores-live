BATALHA DE SEGUIDORES LIVE — INTEGRAÇÃO EXPERIMENTAL

ARQUIVOS
- index.html: jogo com campo para conectar ao servidor de eventos.
- package.json: dependências Node.js.
- server.mjs: ponte de eventos públicos do TikTok LIVE para o jogo.
- render.yaml: configuração inicial de hospedagem gratuita no Render.

COMO FUNCIONA
O servidor usa a biblioteca comunitária não oficial tiktok-live-connector. Ele lê uma LIVE pública pelo nome de usuário, sem senha do TikTok, e envia comentários, curtidas e presentes ao navegador por WebSocket.

PONTUAÇÃO DE DEMONSTRAÇÃO
- Comentário: +5 pontos.
- Curtida: pontos conforme o lote recebido (limitado a 100 por evento).
- Presente: +20 por unidade (até 10 unidades por evento).
- O primeiro participante alterna entre azul e vermelho.

PUBLICAÇÃO PELO CELULAR
1. No GitHub, abra o repositório batalha-de-seguidores-live.
2. Envie/substitua index.html e adicione package.json, server.mjs e render.yaml na raiz do repositório (branch main).
3. No Render, crie uma conta gratuita e escolha New > Blueprint; conecte o GitHub e selecione o repositório.
4. O Render deve detectar render.yaml e criar o serviço. Se pedir confirmação, escolha o plano Free.
5. Aguarde o deploy e copie a URL do serviço, por exemplo https://NOME.onrender.com.
6. Abra o jogo publicado, cole a URL do serviço no campo “Servidor de eventos” e toque em “Conectar LIVE”.
7. Faça a LIVE pública no TikTok e teste comentários, curtidas e presentes.

AVISOS
- Integração experimental, não oficial nem afiliada ao TikTok. O protocolo pode mudar e a conexão pode falhar.
- Render Free pode suspender o serviço após 15 minutos sem tráfego de entrada; ao voltar pode demorar cerca de um minuto.
- Não informe senha, cookies, códigos SMS ou sessão do TikTok a ninguém.
- O servidor conecta ao nome público definido em TIKTOK_USERNAME. Para mudar, ajuste essa variável no Render.
- Isto é um protótipo: não é um sistema de pagamentos nem garante disponibilidade contínua.
