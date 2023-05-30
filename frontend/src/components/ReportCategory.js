import {H2} from "./Typography";
import {Table} from "flowbite-react";
import {useEffect, useState} from "react";
import axios from "axios";
import {CATEGORY_REPORT_LINK} from "../assets/constants";

const ReportCategory = ({classes}) => {
    const [values, setValues] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(CATEGORY_REPORT_LINK);
                console.log("Data: ", res.data);
                setValues(res.data);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    return (
        <div className={`${classes} pl-2`}>
            <br/>
            <H2>Report Category</H2>
            <Table className={"mt-6 w-3/4"}>
                <Table.Head>
                    <Table.HeadCell>
                        category label
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Average Number of Comments
                    </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {values.map((item, index) => (
                        <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {item.label}
                            </Table.Cell>
                            <Table.Cell>
                                {item.avgNumOfCmt}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};

export default ReportCategory;