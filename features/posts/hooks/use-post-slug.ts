import { useParams } from 'next/navigation';

export const usePostSlug = () => {
  const { slug } = useParams();
  return slug as string;
};
