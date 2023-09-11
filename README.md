# Generac Weather Observation Analysis Take-Home Project

I completed this assesment with SvelteKit. The majority of the relevant code files are in `src/routes` and `src/lib`. I chose SvelteKit because it is a framework I've been wanting to learn, but didn't know what to build with it. This gave me the "what"!

Since it's a relatively new and unknown framework, a few words of explanation:

- `+page.svelte` files correspond to the pages of the application, and are mapped to routes by the directory they appear in the source. So `routes/+page.svelte` renders `/`, and `routes/weather/+page.svelte` renders `/weather`.
- `+layout.svelte` files contain markup that wraps all the routes below them.
- Svelte files are similar to Vue, in that they can contain script, styles, and markup for a component or page. My styles are handled with tailwind so I don't use the style tag at all.
- Svelte markup is a superset of html that allows conditionals, looping, and also a fancy promise handling structure that you'll see in my code.

I used the arcgis api for the auto-suggest that narrows down the choices, and retrieves the coordinates of an address. The weather service api did not seem to have this functionality; in fact, the widget on the NWS site uses the arcgis api for this purpose, which is what pointed me in that direction. If solely using the weather api, we would not be able to search by address, but only by latitude and longtitude coordinates.

The arcgis api requires an api key. To run locally, enter it in `.env` as `PUBLIC_ARCGIS_API_KEY=<api_key>`.

Check out the [Live Demo](https://generac-weather-observation.pages.dev/)! (hosted at Cloudflare pages)

OR run locally with following instructions.

## Dependencies

- Node 18
- pnpm (almost certainly will work with npm or yarn, but I haven't tested those)

## Developing

Once you've downloaded the project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
(p)npm run dev

# or start the server and open the app in a new browser tab
(p)npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
(p)npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
