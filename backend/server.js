import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.post('/api/token', async (req, res) => {
  const code = req.body.code;

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', process.env.REDIRECT_URI);

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(
        process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET
      ).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const data = await response.json();
  res.json(data);
});


app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
