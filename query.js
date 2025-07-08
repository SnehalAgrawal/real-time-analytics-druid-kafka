const axios = require("axios");

module.exports = async () => {
  const query = {
    query: `
      SELECT page, COUNT(*) as views
      FROM "clickstream"
      GROUP BY page
      ORDER BY views DESC
      LIMIT 10
    `,
  };

  const res = await axios.post("http://localhost:8888/druid/v2/sql", query);
  return res.data;
};
