## Partial Pre-Rendering (ppr) causes duplicate fetch calls on page revalidation

When `partial pre-rendering` is enabled, it corrupts the functionality of the pages without partial pre-rendering. It makes them trigger the fetch function twice while revalidating.

### Steps to reproduce

1. Run backend server with `npm run backend`.
2. In the separate terminal build and start the app with `npm run build && npm run start`.
3. Open [http://localhost:3000/count](http://localhost:3000/count) in the browser.
4. Wait for the `Cache state` field to change to `stale`.
5. Reload the page twice to see the revalidated page with `Cache state: fresh`.
6. Optionally, open the terminal with the backend and see that in logs `/count` route was triggered twice.

### Expected behavior

The value should be greater than before by 1

### Actual behavior

The value is greater than before by 2, meaning that the fetch was triggered twice.

### Notes

Revalidation on-demand works correctly.
