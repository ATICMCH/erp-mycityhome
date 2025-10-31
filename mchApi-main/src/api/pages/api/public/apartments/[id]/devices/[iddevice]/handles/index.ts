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
  if (result && result[0]) {
    // Normaliza el id de la manija para legacy
    const row = result[0];
    return {
      idmanija: row.idmanija || row.id || row.id_manija,
      ...row
    };
  }
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const iddevice = Array.isArray(req.query.iddevice) ? req.query.iddevice[0] : req.query.iddevice;
  if (!iddevice) {
    res.status(400).json({ error: 'Falta el parámetro iddevice' });
    return;
  }
  const idDevice = parseInt(iddevice as string, 10);
  if (isNaN(idDevice)) {
    res.status(400).json({ error: 'Parámetro iddevice inválido' });
    return;
  }

  if (req.method === 'GET') {
    try {
      const handles = await getHandlesByDevice(idDevice);
      res.status(200).json(handles.map(row => ({ idmanija: row.idmanija || row.id || row.id_manija, ...row })));
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener manijas', details: err });
    }
  } else if (req.method === 'POST') {
    const { etiqueta } = req.body;
    if (!etiqueta) {
      res.status(400).json({ error: 'Falta el campo etiqueta' });
      return;
    }
    try {
      const handle = await createHandle(idDevice, etiqueta);
      if (handle && handle.idmanija) {
        res.status(201).json(handle);
      } else {
        res.status(500).json({ error: 'No se pudo crear la manija' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Error al crear manija', details: err });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
