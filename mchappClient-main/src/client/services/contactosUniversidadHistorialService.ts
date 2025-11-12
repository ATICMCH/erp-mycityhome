import { api } from '../helpers/Util';

export const getHistorialContactoUniversidad = async (id: number) => {
  const res = await api.get(`/api/contactos-universidad?historico=1&id=${id}`);
  return res.data;
};
