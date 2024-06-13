import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world_capitals",
  password: "Shivam@123",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function checkVisited() {
  const result = await db.query("SELECT country_code FROM visited_country");
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}
const countries = await checkVisited();

// console.log(countries);

app.get("/", async (req, res) => {
  const countries = await checkVisited();
  console.log(countries);
  // console.log(result.rows);
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
  });
});

// app.post("/add", async (req, res) => {
//   let country_name = req.body.country;
//   // console.log(country_name);

//   const result = await db.query(
//     "SELECT code FROM all_countries WHERE name =$1  ",

//     [country_name]
//   );

//   let new_country = result.rows[0].code;
//   const entered_country = await db.query(
//     "SELECT country_code FROM visited_country where country_code = $1 ",
//     [new_country]
//   );
//   // console.log(result.rows[0].code);
//   // console.log(typeof result.rows[0].code);

//   // console.log("new",entered_country);

//   if (result.rows[0].code == entered_country.rows[0].country_code) {
//     let existed_error = "Country has already been added, try again.";
//     console.log(existed_error);
//     const countries = await checkVisited();
//     res.render("index.ejs", {
//       error: existed_error,
//       countries: countries,
//       total: countries.length,
//     });
//   }

//   const countryCode = result.rows[0].code;
//   await db.query("INSERT INTO visited_country (country_code) VALUES ($1)", [
//     countryCode,
//   ]);
//   res.redirect("/");
// });
app.post("/add", async (req, res) => {
  let input_country = req.body.country;

  try {
    const result = await db.query(
      "SELECT code FROM all_countries WHERE LOWER(name) LIKE '%' || $1 || '%' ",
      [input_country.toLowerCase()]
    );
    const countryCode = result.rows[0].code;
    try {
      await db.query("INSERT INTO visited_country (country_code) VALUES ($1)", [
        countryCode,
      ]);
      res.redirect("/");
    } catch (err) {
      const countries = await checkVisited();
      res.render("index.ejs", {
        error: "Country has already been added, try again.",

        countries: countries,
        total: countries.length,
      });
    }
  } catch (err) {
    const countries = await checkVisited();
    res.render("index.ejs", {
      error: "Country name does not exist, try again.",
      countries: countries,
      total: countries.length,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// import express from "express";
// import bodyParser from "body-parser";
// import pg from "pg";

// const app = express();
// const port = 3000;

// const db = new pg.Client({
//   user: "postgres",
//   host: "localhost",
//   database: "world_capitals",
//   password: "Shivam@123",
//   port: 5432,
// });
// db.connect();

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));

// app.get("/", async (req, res) => {
//   //Write your code here.

//   const result = await db.query("SELECT country_code FROM visited_country");
//   let countries = [];
//   let error;
//   result.rows.forEach((country) => {
//     countries.push(country.country_code);
//   });
//   console.log(result.rows);
//   res.render("index.ejs", {
//     countries: countries,
//     total: countries.length,
//     error: error
//   });
// });

// app.post("/add", async (req, res) => {
//   let country_name = req.body.country;
//   // console.log(country_name);

//   const result = await db.query(
//     "SELECT code FROM all_countries WHERE name =$1  ",

//     [country_name]
//   );

//   // let country_check = result.rows[0].code;

// const entered_country = await db.query(
//   "SELECT country_code FROM visited_country where country_code = $1 ",
//   [result.rows[0].code]
// );
// console.log(result.rows[0].code);
// console.log(entered_country.rows[0].country_code);

// if (result.rows[0].code === entered_country.rows[0].country_code) {
//  let error = "Country has already been added, try again.";
//   console.log(error)
//  res.redirect("/");
// }

//   if (result.rows.length !== 0) {
//     const countryCode = result.rows[0].code;
//     await db.query("INSERT INTO visited_country (country_code) VALUES ($1)", [
//       countryCode,
//     ]);
//     res.redirect("/");
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });
