import { ITEMS_PER_PAGE } from "../../constants";

export function Pagination({ totalDocs, page, setPage }) {
  const totalPages = Math.ceil(totalDocs / ITEMS_PER_PAGE);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  function handlePageChange(pageNumber) {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setPage(pageNumber);
  }

  const startItem =
    totalDocs === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem =
    page * ITEMS_PER_PAGE > totalDocs
      ? totalDocs
      : page * ITEMS_PER_PAGE;

  return (
    <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Info */}
      <div className="text-sm text-slate-600">
        Showing{" "}
        <span className="font-semibold text-slate-800">{startItem}</span>{" "}
        to{" "}
        <span className="font-semibold text-slate-800">{endItem}</span>{" "}
        of{" "}
        <span className="font-semibold text-slate-800">{totalDocs}</span>{" "}
        results
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className={`px-3 py-2 rounded-md border text-sm font-medium transition
            ${
              page === 1
                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                : "bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
        >
          ‹
        </button>

        {/* Page Numbers */}
        {pages
          .slice(Math.max(0, page - 3), Math.min(page + 2, pages.length))
          .map((p) => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition
                ${
                  p === page
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
            >
              {p}
            </button>
          ))}

        {/* Next */}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className={`px-3 py-2 rounded-md border text-sm font-medium transition
            ${
              page === totalPages
                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                : "bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
        >
          ›
        </button>
      </div>
    </div>
  );
}
