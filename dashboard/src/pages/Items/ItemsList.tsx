import { categoryApi } from "@/api/category_api";
import ColorText from "@/components/ColorText";
import Select, { SelectOption } from "@/components/Select";
import TablePagination from "@/components/TablePagination";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchCookieToken } from "@/functions/GetCookie";
import { Category, Product } from "@/types/types";
import axios from "axios";

import { useEffect, useState } from "react";
import { productApi } from "@/api/product_api";
import AvatarComp from "@/components/AvatarComp";
import SearchComponent from "@/components/SearchComponent";
import { Link } from "react-router-dom";

interface ProductsState extends Product {
  category_name?: string;
  variants?: any;
  images?: string[];
}

const ListCategoryPage: React.FC = () => {
  const token = fetchCookieToken();
  const [parents, setParents] = useState<Category[]>([]);
  const [data, setData] = useState<ProductsState[]>([]);
  // loading state
  const [loading, setLoading] = useState<boolean>(false);
  // pagination states
  const [page, setPage] = useState<number>(1);
  const [totalData, setTotalData] = useState<number>(0);
  const [dataPerPage, setDataPerPage] = useState<number>(10);
  // search state
  // filter states
  const [status, setStatus] = useState<any>("");
  const [sort, setSort] = useState<any>("DESC");
  const [parent, setParent] = useState<any>("");
  const [search, setSearch] = useState<string>("");

  const handleResetFilter = () => {
    setStatus("");
    setSort("A-Z");
    setParent("");
  };

  // force update
  // fetch data
  const fetchData = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${productApi}?page=${page}&limit=${dataPerPage}&status=${status}&category_id=${parent}&search=${search}&sort=${sort}`,
        {
          withCredentials: true,
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setLoading(false);
      setTotalData(data.total);

      setData([...data.data]);
    } catch (error: any) {
      console.log(error); // handle error
    }
  };
  // fetch parents
  const fetchParents = async () => {
    try {
      const { data } = await axios.get(`${categoryApi}`, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setParents([...data.data]);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  useEffect(() => {
    fetchData();
  }, [page, dataPerPage, search, status, sort, parent]);

  // render data
  return (
    <div className="p-7">
      {/* filter */}
      <div>
        <SearchComponent setSearch={setSearch} />
      </div>
      <div className="mb-5 flex flex-col">
        <div className="flex py-2 gap-3 flex-wrap">
          {/* status  */}
          <div className="flex gap-3 items-center">
            <label htmlFor="status">
              <ColorText variant="green">Status: </ColorText>
            </label>

            <Select
              name="status"
              onClick={(e: any) => setStatus(e.target.value)}
            >
              <SelectOption value="" selected={true}>
                All
              </SelectOption>
              <SelectOption value="active">Active</SelectOption>
              <SelectOption value="inactive">Inactive</SelectOption>
            </Select>
          </div>
          {/* sort : ascending or descending or name  */}
          <div className="flex gap-3 items-center">
            <label htmlFor="sort">
              <ColorText variant="pink">Sort: </ColorText>
            </label>

            <Select name="sort" onClick={(e: any) => setSort(e.target.value)}>
              <SelectOption value="ASC" selected={sort == "ASC" && true}>
                Old
              </SelectOption>
              <SelectOption value="DESC" selected={sort == "DESC" && true}>
                New
              </SelectOption>
              <SelectOption
                value="category_name"
                selected={sort == "category_name" && true}
              >
                Category Name
              </SelectOption>
              <SelectOption value="price" selected={sort == "price" && true}>
                Price
              </SelectOption>
              <SelectOption
                value="stock_quantity"
                selected={sort == "stock_quantity" && true}
              >
                Stock
              </SelectOption>
            </Select>
          </div>
          {/* sub-category of :  sub category */}
          <div className="flex gap-3 items-center">
            <label htmlFor="parent">
              <ColorText variant="sky">Sub Category of: </ColorText>
            </label>
            <Select
              name="parent"
              onClick={(e: any) => setParent(e.target.value)}
            >
              <SelectOption value={""} selected={parent == "" && true}>
                Not Selected
              </SelectOption>
              {parents.map((e) => {
                return (
                  <SelectOption
                    selected={parent == e.id.toString() && true}
                    key={e.id}
                    value={e.id.toString()}
                  >
                    {e.category_name}
                  </SelectOption>
                );
              })}
            </Select>
          </div>
        </div>
        <div className="mt-3">
          <Button size={"sm"} onClick={handleResetFilter}>
            Reset Filter
          </Button>
        </div>
      </div>
      <TablePagination
        dataPerPage={dataPerPage}
        totalData={totalData}
        currentPage={page}
        setDataPerPageChange={setDataPerPage}
        setPageChange={setPage}
        className="!justify-start"
      />
      <Table>
        <TableCaption>A list of Users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Id</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead className="text-right">Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading === true ? (
            <TableSkeleton colSpan={8} />
          ) : (
            data.map((u, i) => (
              <TableRow key={u?.id || i}>
                <TableCell>{u?.id}</TableCell>
                <TableCell>
                  <AvatarComp
                    className="!bg-transparent !rounded-md !h-16 !w-16"
                    src={u?.product_thumbnail}
                    alt="name"
                  />
                </TableCell>
                <TableCell>{u?.product_name.slice(0, 40)}...</TableCell>
                <TableCell className={`text-right`}>
                  {u?.category_name}
                </TableCell>
                <TableCell className={`text-right`}>{u?.price}</TableCell>
                <TableCell className={`text-right`}>
                  {u?.stock_quantity}
                </TableCell>
                <TableCell className={`text-right`}>
                  <ColorText
                    variant={`${u?.status == "active" ? "yellow" : "red"}`}
                  >
                    {u?.status}
                  </ColorText>
                </TableCell>
                <TableCell className={`text-right`}>
                  <Link to={`/items/item/${u.id}`}>
                    <Button variant="ghost" className="p-1" size="sm">
                      <ColorText variant="green">View</ColorText>
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={8}>
              <TablePagination
                dataPerPage={dataPerPage}
                totalData={totalData}
                currentPage={page}
                setDataPerPageChange={setDataPerPage}
                setPageChange={setPage}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default ListCategoryPage;
