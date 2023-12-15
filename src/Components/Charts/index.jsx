import React from "react";
import { Line, Pie } from "@ant-design/charts";
import { format } from "date-fns";

function Charts({ sortedTransactions }) {
  const data = sortedTransactions.map((item) => {
    return { date: format(new Date(item.date), "MM/dd/yyyy"), amount: item.amount };
  });

  const spendingData = sortedTransactions
  .filter((transaction) => transaction.type === "expense")
  .map((transaction) => ({
    tag: transaction.tag,
    amount: transaction.amount,
  }));

  let finalSpendings = spendingData.reduce((acc, obj) => {
    let key = obj.tag;
    if (!acc[key]) {
      acc[key] = { tag: obj.tag, amount: obj.amount };
    } else {
      acc[key].amount += obj.amount;
    }
    return acc;
  }, {});

  let newSpending = [
    { tag: "Food", amount: 0 },
    { tag: "Education", amount: 0 },
    { tag: "Investment", amount: 0 },
  ];
  spendingData.forEach((item) => {
    if (item.tag.toLowerCase() == "food") {
      newSpending[0].amount += item.amount;
    } else if (item.tag.toLowerCase() == "education") {
      newSpending[1].amount += item.amount;
    } else {
      newSpending[2].amount += item.amount;
    }
  });

  const config = {
    data: data,
    width: "50%",
    autoFit: true,
    xField: "date",
    yField: "amount",
    tooltip: {
      formatter: (datum) => ({
        name: "Amount",
        value: `$${datum.amount.toFixed(2)}`,
      }),
    },
  };

  const spendingConfig = {
    data: spendingData,
    angleField: "amount",
    colorField: "tag",
  };

  let chart;
  let pieChart;
  return (
    <div className="charts-wrapper">
      <div className="graph-chart">
        <h3 style={{ marginTop: "0" }}>Financial Statistics</h3>
        <Line
          {...config}
          onReady={(chartInstance) => (chart = chartInstance)}
        />
      </div>
      <div className="pie-chart">
        <h3>All Expenses</h3>
        <Pie
          {...spendingConfig}
          onReady={(chartInstance) => (pieChart = chartInstance)}
        />
      </div>
    </div>
  );
}

export default Charts;
