import { Search } from "lucide-react";
import { Input } from "./ui/input";

interface SearchComponentProps {
  className?: string;
  setSearch?: any;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  className,
  setSearch = () => {},
}) => {
  return (
    <div
      className={`relative p-0 border-2 dark:border-slate-900 rounded-md ${className}`}
    >
      <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50 dark:text-white" />
      <Input
        onChange={(e) => setSearch(e.target.value)}
        className="border-none m-0  pl-8"
        placeholder="Search..."
      />
    </div>
  );
};

export default SearchComponent;
