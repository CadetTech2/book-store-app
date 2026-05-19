import Button from '@/components/ui/Button';

export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.totalPages <= 1) return null;

  const pages = [];
  const { page, totalPages } = meta;

  let start = Math.max(1, page - 2);
  let end = Math.min(totalPages, page + 2);

  if (end - start < 4) {
    if (start === 1) end = Math.min(totalPages, start + 4);
    else start = Math.max(1, end - 4);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={!meta.hasPrev}
      >
        Previous
      </Button>
      {start > 1 && (
        <>
          <Button variant="ghost" size="sm" onClick={() => onPageChange(1)}>1</Button>
          {start > 2 && <span className="px-2 text-slate-400">...</span>}
        </>
      )}
      {pages.map((p) => (
        <Button
          key={p}
          variant={p === page ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onPageChange(p)}
        >
          {p}
        </Button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-2 text-slate-400">...</span>}
          <Button variant="ghost" size="sm" onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </Button>
        </>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={!meta.hasNext}
      >
        Next
      </Button>
    </div>
  );
}
