import { H2, Text } from "./Typography";
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
        console.log("Data: ", res.data);
        setValues(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchReport();
  }, []);

  return (
    <div className={`${classes}`}>
      <br />
      <H2>Report Journalist</H2>
      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Published Articles</th>
            <th>Recent Article Title</th>
          </tr>
        </thead>
        <tbody>
          {values.map((journalist) => (
            <tr key={journalist.employee_id}>
              <td>{journalist.fullName}</td>
              <td>{journalist.publishedArticles}</td>
              <td>{journalist.recentArticleTitle}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportJournalist;

// This report lists all journalists who published articles within the last year and shows which
// journalist had the most publications. It lists the journalists in descending order, sorted by the
// number of published articles. Moreover, it gives an overview of all journalists who published
// articles in that period.
// ● Use entities: User, Journalists, Articles
// ● Filtered by: date (last year)
// ● Sorted by: Number of new articles
// ● Columns: “Journalist name”, “Title of most recent article”, “Number of published articles”
