import { useEffect, useState } from "react";
import { format } from "date-fns";
import "./App.css";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

type Recall = {
  id: number;
  data: string;
  recall: number;
};

function App() {
  const [data, setData] = useState<Array<Recall>>([]);
  const [error, setError] = useState("");

  const searchParams = new URLSearchParams(window.location.search);
  const startDate = searchParams.get("from_ts");
  const endDate = searchParams.get("to_ts");

  useEffect(() => {
    const route = `/recall?${startDate ? "from_ts=" + startDate : ""}${
      endDate ? "&to_ts=" + endDate : ""
    }`;

    fetch(route)
      .then((response) => {
        if (response.status !== 200) {
          setError(response.statusText);

          return;
        }

        return response.json();
      })
      .then((data) => setData(data));
  }, [endDate, startDate]);

  return (
    <>
      <h1>Superwise Home Assignment</h1>

      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <ResponsiveContainer height={300} width="100%">
          <LineChart width={500} height={300} data={data}>
            <CartesianGrid />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => {
                return format(new Date(date), "yyyy-MM-dd");
              }}
            />
            <YAxis />
            <Line type="monotone" dataKey="recall" stroke="blue" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </>
  );
}

export default App;
