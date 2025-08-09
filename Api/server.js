const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const { fetchReviewsFromGoogle } = require("./reviewsService");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../Frontend")));

app.get("/reviews/api", async (req, res) => {
  try {
    const placeId = req.query.place_id;
    if (!placeId) return res.status(400).json({ error: "place_id not set" });

    const data = await fetchReviewsFromGoogle(placeId);

    res.json({
      source: "google_api",
      count: data.reviews.length,
      rating: data.rating,
      name: data.name,
      reviews: data.reviews,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/placeid", async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: "query param required" });

    const key = process.env.GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
      query
    )}&inputtype=textquery&fields=place_id,name&key=${key}`;

    const fetch = (...args) =>
      import("node-fetch").then(({ default: fetch }) => fetch(...args));

    const response = await fetch(url);
    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0)
      return res.status(404).json({ error: "Place not found" });

    res.json({
      place_id: data.candidates[0].place_id,
      name: data.candidates[0].name,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
