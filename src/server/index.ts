import csv from "csvtojson";
import express from "express";
export const app = express();

app.get("/recall", async (request, response) => {
  const data = (await csv().fromFile("recall_data.csv")).map(
    ({ index, date, recall }) => ({
      id: index,
      date: new Date(date),
      recall,
    })
  );

  const startDate = request.query.from_ts
    ? new Date(request.query.from_ts.toString())
    : undefined;
  const endDate = request.query.to_ts
    ? new Date(request.query.to_ts.toString())
    : undefined;

  if (!startDate && !endDate) {
    response.status(200).json(data);
    return;
  }

  if (!startDate || !isValidRange(startDate, endDate)) {
    response.sendStatus(400);
    return;
  }

  response
    .status(200)
    .json(data.filter(({ date }) => isWithinRange(date, startDate, endDate)));
});

function isValidDate(date: Date) {
  return date.toString() !== "Invalid Object";
}

function isValidRange(start: Date, end?: Date) {
  if (start && !isValidDate(start)) return false;

  if (!end) return true;

  if (!isValidDate(end)) return false;

  return start < end;
}

function isWithinRange(date: Date, start: Date, end?: Date) {
  if (end) {
    return date >= start && date <= end;
  }

  return date >= start;
}
