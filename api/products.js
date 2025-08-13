import redis from 'redis';

const client = redis.createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD
});

export default async (req, res) => {
  // Autenticación con token de administrador
  const authToken = req.headers.authorization;
  if (!authToken || authToken !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await client.connect();
  
  try {
    switch (req.method) {
      case 'GET':
        const products = await client.hGetAll('products');
        const productsArray = products ? Object.values(products).map(JSON.parse) : [];
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(productsArray);
        break;
        
      case 'POST':
        const newProduct = req.body;
        const id = Date.now().toString();
        await client.hSet('products', id, JSON.stringify({ 
          ...newProduct, 
          id,
          timestamp: Date.now()
        }));
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(201).json({ id, ...newProduct });
        break;
        
      case 'PUT':
        const { id: productId, ...updateData } = req.body;
        const existingProduct = await client.hGet('products', productId);
        if (!existingProduct) {
          return res.status(404).json({ error: 'Product not found' });
        }
        const updatedProduct = {
          ...JSON.parse(existingProduct),
          ...updateData
        };
        await client.hSet('products', productId, JSON.stringify(updatedProduct));
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(updatedProduct);
        break;
        
      case 'DELETE':
        await client.hDel('products', req.query.id);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(204).end();
        break;
        
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Redis error:', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: 'Server error' });
  } finally {
    await client.quit();
  }
};