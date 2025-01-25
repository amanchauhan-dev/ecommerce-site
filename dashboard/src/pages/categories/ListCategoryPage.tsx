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
import { Category } from "@/types/types";
import axios from "axios";

import { useEffect, useState } from "react";
import EditCategory from "./EditCategory";
import WarnDialog from "@/components/WarnDialog";
import { useAppSelector } from "@/hooks/redux.hook";

const ListCategoryPage: React.FC = () => {
  const curUser = useAppSelector((e) => e.User);
  const token = fetchCookieToken();
  const [parents, setParents] = useState<Category[]>([]);
  const [data, setData] = useState<Category[]>([]);
  // loading state
  const [loading, setLoading] = useState<boolean>(false);
  // pagination states
  const [page, setPage] = useState<number>(1);
  const [totalData, setTotalData] = useState<number>(124);
  const [dataPerPage, setDataPerPage] = useState<number>(10);
  // search state
  // filter states
  const [status, setStatus] = useState<any>("");
  const [sort, setSort] = useState<any>("A-Z");
  const [isSub, setIsSub] = useState<any>("");
  const [parent, setParent] = useState<any>("");

  const handleResetFilter = () => {
    setStatus("");
    setSort("A-Z");
    setIsSub("");
    setParent("");
  };

  // force update
  const [force, setForce] = useState<number>(0);
  // fetch data
  const fetchData = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${categoryApi}?page=${page}&limit=${dataPerPage}&status=${status}&order=${sort}&parentId=${parent}&isSub=${isSub}`,
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
      const { data } = await axios.get(`${categoryApi}?isSub=0`, {
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
  // delete data
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const handleDeleteData = async (id: number) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`${categoryApi}/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (data) {
        fetchData();
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchParents();
  }, [force]);

  useEffect(() => {
    fetchData();
  }, [force, page, dataPerPage, status, sort, isSub, parent]);

  // render data
  return (
    <div className="p-7">
      {/* filter */}
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
          {/* isSub : individual or sub category */}
          <div className="flex gap-3 items-center">
            <label htmlFor="isSub">
              <ColorText variant="yellow">Type: </ColorText>
            </label>

            <Select
              name="isSub"
              onClick={(e: any) => {
                setIsSub(e.target.value);
              }}
            >
              <SelectOption value={""} selected={isSub == "" && true}>
                All
              </SelectOption>
              <SelectOption selected={isSub == "1" && true} value="1">
                Sub Categories
              </SelectOption>
              <SelectOption selected={isSub == "0" && true} value="0">
                Parents
              </SelectOption>
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
              <SelectOption value="type" selected={sort == "type" && true}>
                Type
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
      <Table>
        <TableCaption>A list of Users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableCell colSpan={5}>
              <TablePagination
                dataPerPage={dataPerPage}
                totalData={totalData}
                currentPage={page}
                setDataPerPageChange={setDataPerPage}
                setPageChange={setPage}
                className="!justify-start"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="w-[60px]">Id</TableHead>
            <TableHead>Category Name</TableHead>
            <TableHead className="text-right">Type</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading === true ? (
            <TableSkeleton colSpan={5} />
          ) : (
            data.map((u) => (
              <TableRow key={u?.id}>
                <TableCell>{u?.id}</TableCell>
                <TableCell>{u?.category_name}</TableCell>
                <TableCell className={`text-right`}>
                  <ColorText
                    variant={`${u?.isSub == true ? "yellow" : "pink"}`}
                  >
                    {u?.isSub == true ? "Sub" : "Parent"}
                  </ColorText>
                </TableCell>
                <TableCell className={`text-right`}>
                  <ColorText
                    variant={`${u?.status == "active" ? "green" : "red"}`}
                  >
                    {u?.status}
                  </ColorText>
                </TableCell>
                <TableCell className={`text-right`}>
                  {curUser.role == "admin" && (
                    <WarnDialog
                      open={openDelete}
                      setOpen={setOpenDelete}
                      openElement={
                        <div className="inline">
                          <Button variant="ghost" size="sm">
                            <ColorText variant="red">Delete</ColorText>
                          </Button>
                        </div>
                      }
                      onAccept={() => handleDeleteData(u?.id)}
                    />
                  )}

                  <EditCategory setForce={setForce} {...u} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>
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
