# WonderCall Web Embeds

This is the open-source repository with the code regarding WonderCall's Web Embeds.
Feel free to fork them, in case you strive for more customizations, or reach out to [eng@wondercall.ai](mailto:eng@wondercall.ai) to get direct assistance.

## Technologies Used

- [Svelte](https://svelte.dev/) (Frontend Framework)
- [TailwindCSS](https://tailwindcss.com/) (CSS)
- [TypeScript](https://www.typescriptlang.org/) (Static Typing)
- [TurboRepo](https://turbo.build/) (Monorepo organization)
- [ESLint](https://eslint.org/) (Linting)
- [Prettier](https://prettier.io/) (Formatting)


### Embed Versions

- **default**: a simple, timeless embed design

### Build

To build all apps and packages, run the following command:

```
npm build
```

To build specific packages, run the following command:
```
npx turbo build --filter "{your-embed-name}"
```

### Develop

To run all embeds in dev mode, run:

```
npm dev
```

To run only selected ones:

```
npx turbo dev --filter "{your-embed-name}"
```