import { cn } from '@/utils';

const colorMap = {
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  purple: 'bg-purple-100 text-purple-800',
  slate: 'bg-slate-100 text-slate-800',
};

export default function Badge({ children, color = 'blue', className = '' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        colorMap[color] || colorMap.blue,
        className
      )}
    >
      {children}
    </span>
  );
}
