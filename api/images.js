import { createClient } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    const { fileName } = req.query;
    const kv = createClient({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });

    const imageBase64 = await kv.get(`image:${fileName}`);
    if (!imageBase64) return res.status(404).send('Image not found');
    const buffer = Buffer.from(imageBase64, 'base64');
    res.setHeader('Content-Type', `image/${fileName.split('.').pop()}`);
    res.send(buffer);
  } catch (error) {
    console.error('Error retrieving image:', error);
    res.status(500).send('Internal Server Error');
  }
}