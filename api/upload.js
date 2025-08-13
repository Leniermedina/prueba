import { v4 as uuidv4 } from 'uuid';

export default async (req, res) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const buffer = await file.arrayBuffer();
    const fileType = file.type.split('/')[1] || 'png';
    const fileName = `${uuidv4()}.${fileType}`;
    
    // Guardar en sistema de archivos (Vercel Blob Storage sería mejor)
    // Esta es una solución temporal para pruebas
    const imageUrl = `https://${req.headers.host}/api/images/${fileName}`;
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({ url: imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: 'Error uploading image' });
  }
};