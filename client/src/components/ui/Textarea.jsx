import { cn } from '@/utils';

export default function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full px-3 py-2 border rounded-lg text-sm transition-colors resize-vertical',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'placeholder:text-slate-400',
          error ? 'border-red-500' : 'border-slate-300',
          className
        )}
        rows={4}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
