export const config = {
  api: {
    bodyParser: false,
  },
};
export const runtime = 'edge';
import { put } from '@vercel/blob';

function setCORS(headers) {
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST,OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req) {
  const headers = new Headers();
  setCORS(headers);
  if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers });

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400, headers });
    }
    
    const { url } = await put(`uploads/${Date.now()}_${file.name}`, file, { 
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    
    return new Response(JSON.stringify({ url }), { status: 200, headers });
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ error: 'Error uploading image' }), { status: 500, headers });
  }
}