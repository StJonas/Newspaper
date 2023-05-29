import ReportJournalist from "../components/ReportJournalist";
import ReportCategory from "../components/ReportCategory";

const Reports = () => {
    return (
        <div className={"flex"}>
            <ReportJournalist classes={"flex-1 h-full"}/>
            <ReportCategory classes={"flex-1 border-l-2 h-full"}/>
        </div>);
};

export default Reports;