import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface NotifyBarProps {
  message: string;
  type?: 'default' | 'success' | 'warning' | 'error';
  showIcon?: boolean;
  closable?: boolean;
  onClose?: () => void;
}

const NotifyBar = ({ message, type = 'default', showIcon = true, closable = false, onClose }: NotifyBarProps) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/50',
          text: 'text-emerald-800 dark:text-emerald-200',
          border: 'border-emerald-200 dark:border-emerald-800',
          icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/50',
          text: 'text-amber-800 dark:text-amber-200',
          border: 'border-amber-200 dark:border-amber-800',
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
        };
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-950/50',
          text: 'text-red-800 dark:text-red-200',
          border: 'border-red-200 dark:border-red-800',
          icon: <XCircle className="h-5 w-5 text-red-500" />,
        };
      default:
        return {
          bg: 'bg-muted',
          text: 'text-muted-foreground',
          border: 'border-border',
          icon: <Info className="h-5 w-5 text-muted-foreground" />,
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className={`${styles.bg} ${styles.text} ${styles.border} flex items-center gap-3 rounded-md border px-4 py-2`}>
      {showIcon && styles.icon}
      <p className="flex-1 text-sm">{message}</p>
      {closable && (
        <button onClick={onClose} className="text-current transition-opacity hover:opacity-75">
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default NotifyBar;
