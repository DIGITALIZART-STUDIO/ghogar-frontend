/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                montserrat: ["Montserrat", "sans-serif"],
                sans: ["Montserrat", "sans-serif"], // Establece Montserrat como fuente principal
                heading: ["Montserrat", "sans-serif"], // Para títulos
                body: ["Montserrat", "sans-serif"], // Para texto de cuerpo
            },
            fontSize: {
                // Tamaños personalizados
                xs: ["0.75rem", { lineHeight: "1rem" }],
                sm: ["0.875rem", { lineHeight: "1.25rem" }],
                base: ["1rem", { lineHeight: "1.5rem" }],
                lg: ["1.125rem", { lineHeight: "1.75rem" }],
                xl: ["1.25rem", { lineHeight: "1.75rem" }],
                "2xl": ["1.5rem", { lineHeight: "2rem" }],
                "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
                "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
                "5xl": ["3rem", { lineHeight: "1" }],
                // Tamaños personalizados adicionales
                title: ["2rem", { lineHeight: "2.25rem", letterSpacing: "-0.01em", fontWeight: "700" }],
                subtitle: ["1.5rem", { lineHeight: "2rem", letterSpacing: "0", fontWeight: "600" }],
                caption: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.025em", fontWeight: "500" }],
            },
            fontWeight: {
                // Pesos personalizados
                thin: "100",
                extralight: "200",
                light: "300",
                normal: "400",
                medium: "500",
                semibold: "600",
                bold: "700",
                extrabold: "800",
                black: "900",
            },
            letterSpacing: {
                // Espaciado de letras personalizado
                tighter: "-0.05em",
                tight: "-0.025em",
                normal: "0",
                wide: "0.025em",
                wider: "0.05em",
                widest: "0.1em",
                // Valores personalizados
                heading: "-0.025em",
                body: "0.01em",
            },
            lineHeight: {
                // Alturas de línea personalizadas
                none: "1",
                tight: "1.25",
                snug: "1.375",
                normal: "1.5",
                relaxed: "1.625",
                loose: "2",
                // Valores personalizados
                heading: "1.2",
                body: "1.6",
            },
            textIndent: {
                // Sangrías de texto
                sm: "1rem",
                md: "2rem",
                lg: "3rem",
            },
            textShadow: {
                // Sombras de texto
                sm: "0 1px 2px var(--tw-shadow-color)",
                DEFAULT: "0 2px 4px var(--tw-shadow-color)",
                lg: "0 8px 16px var(--tw-shadow-color)",
            },
        },
    },
    plugins: [
    // Plugin para añadir textShadow y textIndent
        function({ addUtilities, theme }) {
            const textIndent = theme("textIndent", {});
            const textIndentUtilities = Object.entries(textIndent).reduce((acc, [key, value]) => {
                acc[`.indent-${key}`] = { textIndent: value };
                return acc;
            }, {});

            const textShadow = theme("textShadow", {});
            const textShadowUtilities = Object.entries(textShadow).reduce((acc, [key, value]) => {
                acc[`.text-shadow${key === "DEFAULT" ? "" : `-${key}`}`] = { textShadow: value };
                return acc;
            }, {});

            addUtilities({ ...textIndentUtilities, ...textShadowUtilities });
        },
    ],
};
