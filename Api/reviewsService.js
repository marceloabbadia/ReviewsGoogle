const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const fs = require("fs");

const POSITIVE = [
  "bom",
  "boa",
  "bons",
  "boas",
  "ótimo",
  "otimo",
  "excelente",
  "maravilhoso",
  "maravilhosa",
  "agradável",
  "agradavel",
  "gostei",
  "gostoso",
  "top",
  "recomendo",
  "super recomendo",
  "indico",
  "fácil",
  "facil",
  "rápido",
  "rapido",
  "eficiente",
  "ótima",
  "otima",
  "feliz",
  "happy",
  "great",
  "good",
  "love",
  "amazing",
  "perfeito",
  "perfeita",
  "ótimos",
  "otimos",
  "legal",
  "show",
  "funciona",
  "funcionou",
  "resolve",
  "agradavelmente",
  "atendimento excelente",
  "boa qualidade",
  "valor justo",
];

const NEGATIVE = [
  "ruim",
  "péssimo",
  "pessimo",
  "horrível",
  "horroroso",
  "insuportável",
  "insuportavel",
  "lento",
  "demora",
  "demorado",
  "não recomendo",
  "nao recomendo",
  "problema",
  "problemas",
  "falha",
  "falhas",
  "péssima",
  "pessima",
  "ruins",
  "fraco",
  "fraca",
  "caro",
  "caríssima",
  "carissima",
  "ódio",
  "odio",
  "hate",
  "bad",
  "terrível",
  "terrivel",
  "decepcionado",
  "decepcionada",
  "péssimos",
  "pessimos",
  "não funciona",
  "nao funciona",
  "travando",
  "travado",
  "atraso",
  "atrasado",
  "péssimo atendimento",
  "reclamo",
  "reclamar",
  "reclamação",
  "reclamacao",
];

function simpleSentiment(text) {
  if (!text) return "neutral";
  const t = text.toLowerCase();

  let score = 0;

  const NEGATIVE_PHRASES = [
    "não recomendo",
    "nao recomendo",
    "não funciona",
    "nao funciona",
  ];

  for (const phrase of NEGATIVE_PHRASES) {
    if (t.includes(phrase)) {
      score -= 2;
      t = t.replace(phrase, "");
    }
  }

  POSITIVE.forEach((w) => {
    if (t.includes(w)) score += 1;
  });
  NEGATIVE.forEach((w) => {
    if (t.includes(w)) score -= 1;
  });

  if (score > 0) return "positive";
  if (score < 0) return "negative";
  return "neutral";
}

async function fetchReviewsFromGoogle(placeId) {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) throw new Error("GOOGLE_API_KEY not set in env");

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews&reviews_sort=newest&key=${key}`;

  const resp = await fetch(url);
  const data = await resp.json();
  if (!data || !data.result)
    throw new Error("Invalid response from Google Places API");

  const reviews = (data.result.reviews || []).map((r) => ({
    id: r.author_url
      ? r.author_url
      : `g_${Buffer.from((r.author_name || "") + r.time).toString("base64")}`,
    author_name: r.author_name || "",
    rating: r.rating || null,
    text: r.text || "",
    time: r.time || null,
    relative_time_description: r.relative_time_description || "",
    source: "google_api",
    sentiment_score: simpleSentiment(r.text || ""),
  }));

  return {
    name: data.result.name || "",
    rating: data.result.rating || null,
    reviews,
  };
}

module.exports = { fetchReviewsFromGoogle, simpleSentiment };
