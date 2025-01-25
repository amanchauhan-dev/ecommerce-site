import { userApi } from "@/api/users_api";
import AvatarComp from "@/components/AvatarComp";
import ColorText from "@/components/ColorText";
import SearchComponent from "@/components/SearchComponent";
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
import { User } from "@/types/types";
import axios from "axios";

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const UsersListPage: React.FC = () => {
  const token = fetchCookieToken();
  const [users, setUsers] = useState<User[]>([]);
  // loading state
  const [loading, setLoading] = useState<boolean>(false);
  // pagination states
  const [page, setPage] = useState<number>(1);
  const [totalData, setTotalData] = useState<number>(124);
  const [dataPerPage, setDataPerPage] = useState<number>(10);
  // search state
  const [search, setSearch] = useState<string>("");
  // filter states
  const [status, setStatus] = useState<any>("");
  const [role, setRole] = useState<any>("");
  const [sort, setSort] = useState<any>("DESC");
  const handleResetFilter = () => {
    setStatus("");
    setRole("");
    setSort("DESC");
    setSearch("");
  };
  // fetch data
  const fetchUsersData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${userApi}?page=${page}&limit=${dataPerPage}&search=${search}&role=${role}&status=${status}&sort=${sort}`,
        {
          withCredentials: true,
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setLoading(false);
      setTotalData(data.total);
      setUsers([...data.data]);
    } catch (error: any) {
      console.log(error); // handle error
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, [search, page, dataPerPage, role, status, sort]);

  // render data
  return (
    <div className="p-7">
      {/* search and  filter */}
      <div className="mb-5 flex flex-col">
        <SearchComponent setSearch={setSearch} className="flex-auto" />
        {/* filter */}
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
              <SelectOption value="" selected={status == "" && true}>
                All
              </SelectOption>
              <SelectOption
                selected={status == "active" && true}
                value="active"
              >
                Active
              </SelectOption>
              <SelectOption
                selected={status == "inactive" && true}
                value="inactive"
              >
                Inactive
              </SelectOption>
            </Select>
          </div>
          {/* Role  */}
          <div className="flex gap-3 items-center">
            <label htmlFor="role">
              <ColorText variant="yellow">Role: </ColorText>
            </label>

            <Select name="role" onClick={(e: any) => setRole(e.target.value)}>
              <SelectOption value="" selected={role == "" && true}>
                All
              </SelectOption>
              <SelectOption selected={role == "admin" && true} value="admin">
                Admin
              </SelectOption>
              <SelectOption
                selected={role == "employee" && true}
                value="employee"
              >
                Employee
              </SelectOption>
              <SelectOption
                selected={role == "customer" && true}
                value="customer"
              >
                Customer
              </SelectOption>
            </Select>
          </div>
          {/* sort i.e., ascending or descending  */}
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
              <SelectOption value="name" selected={sort == "name" && true}>
                Name
              </SelectOption>
              <SelectOption value="email" selected={sort == "email" && true}>
                Email
              </SelectOption>
              <SelectOption value="role" selected={sort == "role" && true}>
                Role
              </SelectOption>
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
            <TableCell colSpan={7}>
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
            <TableHead className="w-[70px]">Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right">Role</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading === true ? (
            <TableSkeleton colSpan={7} />
          ) : (
            users.map((u) => (
              <TableRow key={u?.id}>
                <TableCell>{u?.id}</TableCell>
                <TableCell>
                  <AvatarComp src={u?.avatar} alt={u?.fname + " " + u?.lname} />
                </TableCell>
                <TableCell>{u?.fname + " " + u?.lname}</TableCell>
                <TableCell>{u?.email}</TableCell>
                <TableCell className={`text-right`}>
                  <ColorText
                    variant={`${u?.status == "active" ? "green" : "red"}`}
                  >
                    {u?.status}
                  </ColorText>
                </TableCell>
                <TableCell className={`text-right`}>
                  {" "}
                  <ColorText
                    variant={`${
                      u?.role == "admin"
                        ? "red"
                        : u?.role == "employee"
                        ? "yellow"
                        : "green"
                    }`}
                  >
                    {u?.role}
                  </ColorText>
                </TableCell>
                <TableCell className={`text-right`}>
                  <NavLink to={"/users/user-details/" + u.id}>
                    <Button variant="ghost" size="sm">
                      <ColorText variant="green">View</ColorText>
                    </Button>
                  </NavLink>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={7}>
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

export default UsersListPage;
