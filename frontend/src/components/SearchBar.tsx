import { PageGap } from "./PageGap";

interface SearchBarProps {}

const SearchBar: React.FC<SearchBarProps> = () => {
  return (
    <PageGap className="flex justify-center items-center">
      <input
        placeholder="Search Something..."
        className="border-2 rounded-md py-2 px-3 text-sm w-[90vmin] sm:w-[600px] my-2 dark:text-zinc-800"
      />
    </PageGap>
  );
};

export default SearchBar;
