import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [...Array(totalPages).keys()].map((page) => page + 1);

  return (
    <nav className="flex justify-center mt-6">
      <ul className="flex space-x-2">
        {pages.map((page) => (
          <li key={page}>
            <button
              className={`px-3 py-2 rounded-md font-medium text-sm ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white"
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
        <li>
          <button className="px-3 py-2 rounded-md bg-gray-100 text-gray-700">
            ...
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
