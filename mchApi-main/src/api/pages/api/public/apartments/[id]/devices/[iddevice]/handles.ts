import type { NextApiRequest, NextApiResponse } from 'next';
import Constants from '@/api/helpers/Constants';
import DbConnection from '@/api/helpers/DbConnection';

// Utilidad para obtener manijas de un dispositivo
async function getHandlesByDevice(idDevice: number) {
  const client = new DbConnection(false);
  const query = {
    name: 'get-handles-by-device',
    text: `SELECT * FROM ${Constants.tbl_manija_sql} WHERE iddispositivo = $1 AND estado = 1`,
    values: [idDevice],
  };
  const result = await client.exeQuery(query);
  return result;
}

// Utilidad para crear una manija
async function createHandle(idDevice: number, etiqueta: string) {
  const client = new DbConnection(false);
  const query = {
    name: 'insert-handle',
    text: `INSERT INTO ${Constants.tbl_manija_sql} (iddispositivo, etiqueta, estado) VALUES ($1, $2, 1) RETURNING *`,
    values: [idDevice, etiqueta],
  };
  const result = await client.exeQuery(query);
  return result;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Next.js puede devolver los params como string o array
  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  const iddevice = Array.isArray(req.query.iddevice) ? req.query.iddevice[0] : req.query.iddevice;

  if (!id || !iddevice) {
    res.status(400).json({ error: 'Faltan parámetros id o iddevice' });
    return;
  }
  const idPiso = parseInt(id as string, 10);
  const idDevice = parseInt(iddevice as string, 10);

  if (isNaN(idPiso) || isNaN(idDevice)) {
    res.status(400).json({ error: 'Parámetros id o iddevice inválidos' });
    return;
  }

  if (req.method === 'GET') {
    // Listar manijas
    try {
      const handles = await getHandlesByDevice(idDevice);
      res.status(200).json(handles);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener manijas', details: err });
    }
  } else if (req.method === 'POST') {
    // Crear manija
    const { etiqueta } = req.body;
    if (!etiqueta) {
      res.status(400).json({ error: 'Falta el campo etiqueta' });
      return;
    }
    try {
      const handle = await createHandle(idDevice, etiqueta);
      res.status(201).json(handle);
    } catch (err) {
      res.status(500).json({ error: 'Error al crear manija', details: err });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
