# squid-js

Browser-usable FHE over [cedoor/squid](https://github.com/cedoor/squid) (an ergonomic Rust wrapper around Poulpy), packaged as a pnpm + Cargo monorepo with a client/server demo.

The browser generates its own `(secret_key, evaluation_key)` pair, ships only the evaluation key and ciphertexts to the server, and decrypts results locally. The server never sees plaintexts and never holds secret-key material.

```
squid-js/
├─ Cargo.toml                  # Rust workspace
├─ pnpm-workspace.yaml
├─ package.json                # root scripts
├─ crates/
│  ├─ squid-wasm/              # wasm-bindgen bindings (browser)
│  ├─ squid-napi/              # napi-rs bindings (Node server)
│  └─ criterion-shim/          # no-op `criterion` replacement; see below
├─ packages/
│  └─ squid-js/                # TS wrapper: SquidClient API over wasm
└─ apps/
   ├─ client/                  # Vite + React demo
   ├─ server/                  # Node + Express demo
   └─ e2e/                     # Playwright end-to-end tests
```

## Prerequisites

- Rust nightly (pinned in `rust-toolchain.toml`), with the `wasm32-unknown-unknown` target
- [`wasm-pack`](https://rustwasm.github.io/wasm-pack/) (`cargo install wasm-pack`)
- Node.js 20+ and pnpm 9+

## Build

```sh
pnpm install
pnpm build          # build:wasm → build:napi → build:js → build:server → build:client
pnpm dev            # server on :3001, client on :5173
pnpm test:e2e       # Playwright: installs Chromium (pretest), runs demo flow
```

Individual steps are also available (`pnpm build:wasm`, `pnpm build:napi`, …).

### CI

GitHub Actions (`.github/workflows/e2e.yml`) runs `pnpm install`, `pnpm build`, and `pnpm test:e2e` on pushes and pull requests to `main` / `master`.

## How it works

1. **Browser.** `SquidClient.create()` initializes the wasm module, calls `Session::new_random` (which forwards to `squid::Context::keygen_with_seeds` under `Params::test()`), and exposes `evaluationKey`, `encryptU32`, `decryptU32`, and `exportSeeds`.
2. **Client → server handshake.** The browser POSTs raw evaluation-key bytes (`Content-Type: application/octet-stream`) to `POST /session`. The server deserializes into a `squid_napi::Evaluator` and stores it in an in-memory `Map` keyed by a UUID.
3. **Compute.** The browser POSTs packed ciphertext bytes to `POST /session/:id/add`. The server deserializes both, runs homomorphic add, and returns the serialized result ciphertext.
4. **Decrypt.** Browser calls `client.decryptU32(result)`; secret-key material never leaves the page.

## Why `crates/criterion-shim`?

Poulpy 0.5.0 declares `criterion` in `[dependencies]` (not `[dev-dependencies]`), and several library modules import `criterion::{Criterion, BenchmarkId}` for `pub fn bench_*` helpers. Real criterion transitively depends on `rayon`, which does not compile on `wasm32-unknown-unknown`.

The shim crate provides the exact subset of the 0.8 API Poulpy's library surface touches, as no-ops. Poulpy's `bench_*` helpers type-check but are never called on our hot path, so the bodies never run. Workspace `[patch.crates-io]` redirects `criterion` to the shim for every target.

When upstream Poulpy moves criterion to `[dev-dependencies]`, delete the shim and the patch entry.

## Known constraints

- `Params::test()` — same layout bundle as Poulpy’s `bdd_arithmetic` **test_suite** (smaller and faster than the `bdd_arithmetic` example / `Params::unsecure()`). Not a vetted production security level.
- Sessions are in-memory and unauthenticated (single-process demo only).
- Keygen runs synchronously in the browser wasm until it finishes; the demo UI stays on “Booting wasm…” during that time.
