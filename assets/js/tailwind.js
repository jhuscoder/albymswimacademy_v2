// Tailwind config for brand palette
tailwind.config = {
    theme: {
    extend: {
        colors: {
        brand: {
            900: "#0A2540", // Deep Blue
            700: "#0F355A",
            600: "#13446F",
            500: "#15507E",
            400: "#00C2FF", // Aqua Neon
            300: "#4DD7FF", // Soft Cyan
        },
        },
        boxShadow: {
        glow: "0 0 40px rgba(77,215,255,0.25)",
        },
        fontFamily: {
        display: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        },
    },
    },
};