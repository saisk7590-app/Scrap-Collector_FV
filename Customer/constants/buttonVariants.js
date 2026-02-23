// Centralized button variants (explicit colors)

export const BUTTON_VARIANTS = {
  /* ================= PRIMARY (Main CTA) ================= */
  primary: {
    backgroundColor: "#03C75A", // GREEN
    textColor: "#FFFFFF",       // WHITE
    borderWidth: 0,
    borderColor: "transparent",
  },

  /* ================= SECONDARY (Outline Button) ================= */
  secondary: {
    backgroundColor: "#FFFFFF", // WHITE
    textColor: "#03C75A",        // GREEN text
    borderWidth: 1,
    borderColor: "#03C75A",      // GREEN border
  },

  /* ================= INFO (BLUE – your previous Add Address button) ================= */
  info: {
    backgroundColor: "#2563EB", // BLUE
    textColor: "#FFFFFF",       // WHITE
    borderWidth: 0,
    borderColor: "transparent",
  },

  /* ================= SUCCESS ================= */
  success: {
    backgroundColor: "#16A34A", // DARK GREEN
    textColor: "#FFFFFF",
    borderWidth: 0,
    borderColor: "transparent",
  },

  /* ================= WARNING ================= */
  warning: {
    backgroundColor: "#F97316", // ORANGE
    textColor: "#FFFFFF",
    borderWidth: 0,
    borderColor: "transparent",
  },

  /* ================= DANGER (Logout / Delete) ================= */
  danger: {
    backgroundColor: "#EF4444", // RED
    textColor: "#FFFFFF",
    borderWidth: 0,
    borderColor: "transparent",
  },

  /* ================= DANGER SOFT ================= */
  "danger-soft": {
    backgroundColor: "#FEE2E2", // LIGHT RED
    textColor: "#B91C1C",       // DARK RED TEXT
    borderWidth: 1,
    borderColor: "#B91C1C",
  },

  /* ================= OUTLINE ================= */
  outline: {
    backgroundColor: "transparent",
    textColor: "#03C75A",       // GREEN
    borderWidth: 1,
    borderColor: "#03C75A",
  },
};
