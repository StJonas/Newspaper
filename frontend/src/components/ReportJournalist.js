import { H2 } from "./Typography";
import { Table } from "flowbite-react";
import { ARTICLES_REPORT_LINK } from "../assets/constants";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

const ReportJournalist = ({ classes }) => {
  const [values, setValues] = useState([]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(ARTICLES_REPORT_LINK);
        setValues(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchReport();
  }, []);

  return (
    <div className={`${classes}`}>
        <br/>
        <H2>Report Journalist</H2>
        <Table className={"mt-6 w-3/4"}>
            <Table.Head>
                <Table.HeadCell>
                    Full Name
                </Table.HeadCell>
                <Table.HeadCell>
                    Published Articles
                </Table.HeadCell>
                <Table.HeadCell>
                    Recent Article Title
                </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
                {values.map((journalist) => (
                    <Table.Row key={journalist.employee_id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {journalist.fullName}
                        </Table.Cell>
                        <Table.Cell>
                            {journalist.publishedArticles}
                        </Table.Cell>
                        <Table.Cell>
                            {journalist.recentArticleTitle}
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    </div>
  );
};

export default ReportJournalist;
