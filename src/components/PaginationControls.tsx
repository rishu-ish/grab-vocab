'use client';

interface Props {
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  totalPages: number;
}

export default function PaginationControls({ page, setPage, limit, setLimit, totalPages }: Props) {
  const handlePrev = () => setPage(Math.max(page - 1, 1));
  const handleNext = () => setPage(Math.min(page + 1, totalPages));
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
      <div>
        <label className="mr-2 font-medium">Words per page:</label>
        <select
          value={limit}
          onChange={handleLimitChange}
          className="border px-2 py-1 rounded bg-slate-50"
        >
          {[5, 10, 20, 50].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-4">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
          onClick={handlePrev}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-lg font-semibold">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
          onClick={handleNext}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}