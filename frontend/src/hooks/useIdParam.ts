import { useParams } from 'react-router';

export const useIdParam = () => {
  const { id } = useParams<{ id: string }>();
  if (id === 'ajouter') return null;
  if (isNaN(Number(id))) return null;
  return Number(id);
};
