export const Pagination = ({ total, page, perPage, totalPages, onPageChange, onPerPageChange, label = 'Data' }) => {
  const perPageOptions = [25, 50, 100, 200];

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t bg-white text-sm flex-wrap gap-3">
      <p className="text-gray-600">
        Terdapat <span className="font-bold text-orange-500">{total}</span> {label}
      </p>

      <div className="flex items-center gap-3">
        <select
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          className="border rounded-md pl-3 pr-2 py-1.5 text-sm font-medium text-gray-700 bg-white cursor-pointer"
        >
          {perPageOptions.map((opt) => (
            <option key={opt} value={opt}>Per {opt}</option>
          ))}
        </select>

        <div className="flex items-center border rounded-md overflow-hidden">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ‹
          </button>
          <span className="px-3 py-1.5 text-blue-600 font-medium border-x">
            Hal {page} Dari {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};