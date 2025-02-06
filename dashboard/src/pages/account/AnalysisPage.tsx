import { AreaChartComponent } from "@/components/graphs/AreaChart";
import BarChartComponent from "@/components/graphs/BarChart";
import { PieChartComponent } from "@/components/graphs/PieChart";
import { RadarChartComponent } from "@/components/graphs/RadarChart";


const AnalysisPage: React.FC = () => {
  return (
    <div className=" p-3">
      <div className=" p-3 flex flex-wrap gap-3">
        <AreaChartComponent />
        <RadarChartComponent />
      </div>
      <div className=" p-3 flex flex-wrap gap-3">
        <PieChartComponent />
        <BarChartComponent />
      </div>
    </div>
  );
};

export default AnalysisPage;
