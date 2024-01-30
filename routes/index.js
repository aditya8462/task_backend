var express = require("express");
var router = express.Router();
const csv = require("csvtojson");

/* GET home page. */

function downsampleData(data, targetPoints) {
  const intervalSize = Math.ceil(data.length / targetPoints);
  const downsampledData = [];

  for (let i = 0; i < data.length; i += intervalSize) {
    const startIndex = i;
    const endIndex = Math.min(i + intervalSize, data.length);
    const intervalData = data.slice(startIndex, endIndex);

    const averageProfit =
      intervalData.reduce(
        (sum, point) => sum + Number(point["Profit Percentage"]),
        0
      ) / intervalData.length;

    const timestamp = intervalData[0].Timestamp;

    downsampledData.push({ timestamp, profitPercentage: averageProfit });
  }

  return downsampledData;
}

router.get("/", async function (req, res, next) {
  const jsonArray = await csv().fromFile("public/images/dataset.csv");
  const downsampledData = downsampleData(jsonArray, 555);
  let years = downsampledData.map((item) =>
    String(new Date(item.timestamp).getFullYear())
  );
  years = [...new Set(years)];
  let data = downsampledData.map((item) => item.profitPercentage);
  res.status(200).json({ years, data, status: true });
});

module.exports = router;
