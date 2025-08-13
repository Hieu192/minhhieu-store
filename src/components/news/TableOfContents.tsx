import { headings } from "@/ultis/helps";

const TableOfContents = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Mục lục</h3>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 'h3' ? 'ml-4' : ''}>
            <a
              href={`#${heading.id}`}
              className="text-sm text-gray-700 hover:text-blue-600 transition"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;
