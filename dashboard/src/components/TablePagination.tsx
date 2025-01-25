import Select, { SelectOption } from "@/components/Select";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import ColorText from "./ColorText";
import { useEffect, useState } from "react";

interface TablePaginationProps {
  totalData: number;
  currentPage: number;
  dataPerPage: number;
  setPageChange?: any;
  setDataPerPageChange?: any;
  className?: string;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalData,
  dataPerPage,
  setPageChange,
  setDataPerPageChange,
  className = "",
}) => {
  const [maxPage, setMaxPage] = useState<number>(0);
  useEffect(() => {
    setPageChange(1);
    setMaxPage(Math.ceil(totalData / dataPerPage));
  }, [totalData, dataPerPage]);

  // handle page change
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setPageChange(currentPage - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < maxPage) {
      setPageChange(currentPage + 1);
    }
  };

  // handle data per page change
  const handleDataPerPageSelect = (e: any) => {
    setDataPerPageChange(e.target.value);
  };

  return (
    <div className={`flex w-full justify-end items-center gap-3 ${className}`}>
      {/* total record */}
      <div className="border-2 dark:border-slate-800 p-1 rounded-lg px-3">
        <ColorText>
          Total Record: <ColorText variant="green">{totalData}</ColorText>
        </ColorText>
      </div>
      <div className="border-2 dark:border-slate-800 p-1 rounded-lg px-3">
        <ColorText variant="pink">Data per page</ColorText>
        <Select
          name="rows"
          onClick={handleDataPerPageSelect}
          className="border-none outline-none"
        >
          <SelectOption
            selected={dataPerPage.toString() == "10" && true}
            value="10"
          >
            10
          </SelectOption>
          <SelectOption
            selected={dataPerPage.toString() == "20" && true}
            value="20"
          >
            20
          </SelectOption>
          <SelectOption
            selected={dataPerPage.toString() == "30" && true}
            value="30"
          >
            30
          </SelectOption>
          <SelectOption
            selected={dataPerPage.toString() == "40" && true}
            value="40"
          >
            40
          </SelectOption>
          <SelectOption
            selected={dataPerPage.toString() == "50" && true}
            value="50"
          >
            50
          </SelectOption>
          <SelectOption
            selected={dataPerPage.toString() == "75" && true}
            value="75"
          >
            75
          </SelectOption>
          <SelectOption
            selected={dataPerPage.toString() == "100" && true}
            value="100"
          >
            100
          </SelectOption>
        </Select>
      </div>
      {/* pagination */}
      <div className="border-2 dark:border-slate-800 p-1 rounded-lg px-3 flex items-center gap-2">
        <ColorText>Page</ColorText>
        <ColorText variant="sky">{currentPage}</ColorText>
        <ColorText>of</ColorText>
        <ColorText variant="sky">{maxPage}</ColorText>
      </div>
      {/* page navigation */}
      <div className="flex gap-4 items-center ml-auto">
        <ColorText
          onClick={handlePreviousPage}
          className="flex justify-center items-center w-8"
          title="Previous"
        >
          {currentPage > 1 && <ArrowBigLeft />}
        </ColorText>
        <ColorText
          title="Next"
          className="flex justify-center items-center w-8"
          onClick={handleNextPage}
        >
          {currentPage < maxPage && <ArrowBigRight />}
        </ColorText>
      </div>
    </div>
  );
};

export default TablePagination;
