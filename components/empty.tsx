import { FileTextIcon } from 'lucide-react';

interface EmptyProps {
  title?: string;
  description?: string;
}

const Empty = ({ title = 'No content', description }: EmptyProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center py-12 text-center">
      <FileTextIcon className="mb-4 h-12 w-12 text-gray-400" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
};

export default Empty;
