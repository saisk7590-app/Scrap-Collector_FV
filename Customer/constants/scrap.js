export const SCRAP_CATEGORIES = ["E-Waste", "Paper", "Metal", "Plastic"];

export const SCRAP_DATA = {
  "E-Waste": [
    "Desktop CPU",
    "Laptop",
    "Monitor (LED/CRT)",
    "Television",
    "Printer/Scanner",
    "Keyboard",
    "Mouse",
    "Mobile phone",
    "Charger",
  ],
  Paper: ["Office Paper", "Newspaper", "Magazines", "Cardboard", "Books"],
  Metal: ["Iron Scrap", "Steel rods", "Aluminium utensils", "Copper wires", "Brass fittings"],
  Plastic: ["Buckets", "Bottles", "Toys", "Kitchen plastic items"],
};

// Measurement type: "quantity" or "weight"
export const SCRAP_CONFIG = {
  // Paper
  "Office Paper": "weight",
  Newspaper: "weight",
  Magazines: "weight",
  Cardboard: "weight",
  Books: "weight",

  // E-Waste
  "Desktop CPU": "quantity",
  Laptop: "quantity",
  "Monitor (LED/CRT)": "quantity",
  Television: "quantity",
  "Printer/Scanner": "quantity",
  Keyboard: "quantity",
  Mouse: "quantity",
  "Mobile phone": "quantity",
  Charger: "quantity",

  // Metal
  "Iron Scrap": "weight",
  "Steel rods": "weight",
  "Aluminium utensils": "weight",
  "Copper wires": "weight",
  "Brass fittings": "weight",

  // Plastic
  Buckets: "quantity",
  Bottles: "quantity",
  Toys: "quantity",
  "Kitchen plastic items": "quantity",
};
