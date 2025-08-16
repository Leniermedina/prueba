import { put } from '@vercel/blob';
import { getEnv } from './env';
export async function uploadImage(file: File | Blob, pathname: string) {
  const { BLOB_READ_WRITE_TOKEN } = getEnv();
  const result = await put(pathname, file, { access: 'public', token: BLOB_READ_WRITE_TOKEN, addRandomSuffix: true });
  return result;
}
