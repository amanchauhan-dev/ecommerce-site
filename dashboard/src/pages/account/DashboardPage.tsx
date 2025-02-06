import AvatarComp from "@/components/AvatarComp";
import BackgroundPlate from "@/components/BackgroundPlate";
import ColorText from "@/components/ColorText";
import { PieChartComponent } from "@/components/graphs/PieChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NumberFormater } from "@/functions/NumberFormater";
import { ChartLine, DollarSign, ShoppingCart, UserRound } from "lucide-react";


const DashboardPage: React.FC = () => {
  return (
    <section className="p-3">
      {/* // report data */}
      <div className="flex flex-wrap gap-3">
        <BackgroundPlate
          darkBack="#0967cc"
          lightBack="#0967cc"
          className="flex gap-2 items-center flex-auto min-w-[250px] h-24 justify-evenly   rounded-lg shadow-lg"
        >
          <div className="flex flex-col ">
            <span className="text-white font-bold">Today's Orders</span>
            <span className=" text-white text-xl">12</span>
          </div>
          <div>
            <span className="text-white text-3xl">
              <ShoppingCart size="50px" />
            </span>
          </div>
        </BackgroundPlate>
        <BackgroundPlate
          darkBack="#e504d6"
          lightBack="#e504d6"
          className="flex gap-2 items-center flex-auto min-w-[250px] justify-evenly h-24 rounded-lg shadow-lg"
        >
          <div className="flex flex-col">
            <span className="text-white font-bold">New Users</span>
            <span className=" text-white text-xl">5</span>
          </div>
          <div>
            <span className="text-white text-3xl">
              <UserRound size="50px" />
            </span>
          </div>
        </BackgroundPlate>
        <BackgroundPlate
          darkBack="#5bad04"
          lightBack="#5bad04"
          className="flex gap-2 items-center flex-auto min-w-[250px] justify-evenly h-24 rounded-lg shadow-lg"
        >
          <div className="flex flex-col">
            <span className="text-white font-bold">Today's Sell</span>
            <span className=" text-white text-xl">5</span>
            <span className=" text-white text-sm">
              Total {NumberFormater(3344243)}
            </span>
          </div>
          <div>
            <span className="text-white text-3xl">
              <ChartLine size="50px" />
            </span>
          </div>
        </BackgroundPlate>
        <BackgroundPlate
          darkBack="#9607ec"
          lightBack="#9607ec"
          className="flex gap-2 items-center flex-auto min-w-[250px] justify-evenly h-24 rounded-lg shadow-lg"
        >
          <div className="flex flex-col">
            <span className="text-white font-bold">Today's Revenue</span>
            <span className=" text-white text-xl flex items-center">
              <DollarSign size="25px" /> 545
            </span>
            <span className=" text-white text-sm flex items-center">
              Total : <DollarSign size="15px" /> {NumberFormater(34243)}
            </span>
          </div>
          <div>
            <span className="text-white text-3xl">
              <DollarSign size="50px" />
            </span>
          </div>
        </BackgroundPlate>
      </div>
      {/* // daily analysis */}
      <div className="mt-2">
        <ColorText>Reports & Analytics</ColorText>
        <div className="flex flex-wrap gap-2 mt-4">
          <NewOrders />
          <PieChartComponent />
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;

interface NewOrdersProps {}

const NewOrders: React.FC<NewOrdersProps> = () => {
  return (
    <Card className="flex flex-col flex-auto min-w-[250px] min-h-96 ">
      <CardHeader className="items-center pb-0">
        <CardTitle>New Orders</CardTitle>
        <CardDescription>
          Here are some latest orders and there information
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead>Pic</TableHead>
              <TableHead colSpan={2}>Title</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4,5,6].map((e) => {
              return (
                <TableRow key={e}>
                  <TableCell>
                    <AvatarComp
                      src=""
                      className="!rounded-md !h-12 !w-12"
                      alt="PC C"
                    />
                  </TableCell>
                  <TableCell colSpan={2}>Laptop case, lather 15...</TableCell>
                  <TableCell className="text-center">1</TableCell>
                  <TableCell className="text-center">299</TableCell>
                  <TableCell className="text-center">shipped</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          To get complete information go to orders page
        </div>
      </CardFooter>
    </Card>
  );
};
