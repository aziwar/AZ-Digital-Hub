declare module 'tailwindcss/defaultTheme' {
  interface FontConfig {
    sans?: string[];
    serif?: string[];
    mono?: string[];
  }

  interface DefaultTheme {
    fontFamily?: FontConfig;
    [key: string]: unknown;
  }

  const defaultTheme: DefaultTheme;
  export = defaultTheme;
}

declare module '@tailwindcss/typography' {
  const typography: () => { handler: () => unknown };
  export = typography;
}

declare module '@tailwindcss/forms' {
  const forms: () => { handler: () => unknown };
  export = forms;
}

declare module 'tailwindcss-animate' {
  const animate: () => { handler: () => unknown };
  export = animate;
}