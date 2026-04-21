# Poulpy JS

JavaScript bindings for [Poulpy](https://github.com/poulpy-fhe/poulpy) FHE: a **browser** client (WebAssembly) and a **Node** evaluator (napi-rs). The client holds the secret key; the server only receives the evaluation key and ciphertexts.

## Install

```sh
npm install poulpy-js
```

Use `pnpm add poulpy-js` or `yarn add poulpy-js` if you prefer. The server entry point ships a native addon; install on the platform you run Node on.

## Usage

**Browser** — import `poulpy-js/client`:

```ts
import { init, PoulpyClient } from "poulpy-js/client";

await init();
const client = await PoulpyClient.create({ paramsSet: "test" });
const ct = client.encryptU32(42);
// Send `client.evaluationKey` and `ct` to the server; decrypt results with `client.decryptU32(...)`.
```

**Node** — import `poulpy-js/server` (native addon; not for bundlers targeting the browser):

```ts
import { Evaluator } from "poulpy-js/server";

const ev = Evaluator.load(evaluationKeyBytes, "test");
const sum = ev.addU32(ctA, ctB);
```

The `./wasm/*` export serves the built `.wasm` assets for hosting or custom `init()` URLs.

## Build

Requires Rust (`wasm-pack`), and for the server target, a normal napi build environment.

```sh
pnpm run build
```

This runs `build:wasm`, `build:napi`, and `build:ts` in order. Node **≥ 20** is required.
