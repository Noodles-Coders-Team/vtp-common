# vtp-common

The shared contract for **VTP** (Video Tracking and Planning): one zod schema per entity,
the TypeScript DTOs inferred from them, the `UserRoles` enum both sides check against, and
the `ValidateSchema` helper they use to enforce the shapes.

Nothing in here talks to a database or a network. It is types and validation only, which
is what lets the API and the client agree on a payload shape without either one importing
the other.

Part of a three repository set:

| Repo | Role |
| --- | --- |
| **vtp-common** | this repo, the shared schemas and DTOs |
| [vtp-backend](https://github.com/Noodles-Coders-Team/vtp-backend) | the REST API |
| [vtp-front](https://github.com/Noodles-Coders-Team/vtp-front) | the web client |

## Getting started

Prerequisites: Node.js 20+.

```bash
npm install
npm run build   # tsc → dist/
```

**Build before the consumers install.** Both sibling repos link this package with
`"@nct/vtp-common": "file:../vtp-common"`, and `package.json` points `main`/`types` at
`dist/`, which is git ignored. A fresh clone has no `dist/`, so until you build it their
`npm install` resolves the package but every import from it fails. The three repos must
sit next to each other on disk for the `file:` link to work.

`prepare` also runs `tsc`, so an `npm install` inside this repo produces a build as a side
effect.

Re-run the build after every schema change: the `file:` link serves `dist/`, not `src/`,
so an unbuilt edit is invisible to the API and the client.

> The `prebuild` and `preprepare` scripts are `if exist dist rmdir /s /q dist` — **cmd.exe
> syntax**. They fail on macOS and Linux. Only the clean step is affected: `tsc` still
> overwrites `dist/`, so a plain `npx tsc` works anywhere.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run build` | Clears `dist/` and compiles `src/` with `tsc` |
| `npm run prepare` | Same thing, run automatically by `npm install` |

There is no test script and no linter here. `tsconfig.json` is strict and adds
`noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`, so it is stricter than either
consumer — code that compiles here will compile there.

## What it exports

Everything is re-exported from [src/index.ts](src/index.ts), so consumers import from the
package root:

```ts
import {type SteamAppDto, SteamAppSchema, UserRoles, ValidateSchema} from "@nct/vtp-common";
```

| Module | Schemas | Types |
| --- | --- | --- |
| [user.ts](src/schemas/user.ts) | `UserSignUp`, `UserSignInDto` | `UserSignUpDto`, `UserSignInDto` |
| [setting.ts](src/schemas/setting.ts) | `SettingSchema` | `SettingDto` |
| [steam_app.ts](src/schemas/steam_app.ts) | `SteamAppSchema` | `SteamAppDto` |
| [steam_app_reference_data.ts](src/schemas/steam_app_reference_data.ts) | `SteamAppRefDataSchema` | `SteamAppRefDataDto` |
| [user_steam_app_ref_data_config.ts](src/schemas/user_steam_app_ref_data_config.ts) | `UserSteamAppRefDataConfigSchema` | `UserSteamAppRefDataConfigDto` |
| [user_game_score_config.ts](src/schemas/user_game_score_config.ts) | `UserGameScoreConfigSchema` | `UserGameScoreConfigDto` |
| [enums/UserRoles.ts](src/enums/UserRoles.ts) | — | `UserRoles` enum (`user`, `admin`) |
| [helpers/validators.ts](src/helpers/validators.ts) | — | `ValidateSchema()` |

### What is in `src/` but not exported

Two groups of files compile into `dist/` and are *not* reachable from the package root,
because `index.ts` does not re-export them:

* **The pre-Steam model**, commented out in `index.ts`: `game.ts`, `game_info.ts`,
  `game_with_info.ts`, `rank.ts`, `post.ts`, `post_information.ts`, `channel_data.ts`,
  `drop_down_data.ts`. These describe the old game-queue/YouTube-post domain that the
  backend no longer serves. Nothing imports them today; they are kept for reference.
* **[user_steam_app_ref_data_config_list.ts](src/schemas/user_steam_app_ref_data_config_list.ts)**,
  which was never added to `index.ts`. `UserSteamAppRefDataConfigListSchema` and
  `UserSteamAppRefDataConfigListDto` are therefore only usable through
  `UserGameScoreConfigSchema`, which composes the list internally, or through a deep
  import of `@nct/vtp-common/dist/schemas/...`. There is no `exports` map in
  `package.json`, so deep imports do resolve — `vtp-front` uses one in
  `SteamAppGlobalSearchPage.tsx` — but they bypass the root as the single entry point and
  are better replaced by an export here.

### The Steam scoring schemas

These three are the current core of the contract and build on each other:

```
SteamAppRefDataSchema              id, value, type: GENRE | CATEGORY | TAG
  └─ UserSteamAppRefDataConfigSchema   the same row + score (int, default 0)
       └─ UserGameScoreConfigSchema    id, user_id, score_config_label,
                                       score_config: UserSteamAppRefDataConfig[]
```

`SteamAppRefDataSchema.type` is a `z.enum(['GENRE', 'CATEGORY', 'TAG'])` that mirrors the
`SteamAppReferenceDataType` enum in the backend's Prisma schema by hand — change one and
change the other.

### Conventions

* **DTOs are always `z.infer`**, never hand-written. Change the schema and the type
  follows.
* **`XSchema` for the schema, `XDto` for the inferred type.** [user.ts](src/schemas/user.ts)
  is the exception on both counts: the sign-up schema is called `UserSignUp` with no
  suffix, and `UserSignInDto` is *both* a schema constant and a type of the same name
  (TypeScript keeps the value and the type in separate namespaces, so this compiles —
  `UserSignInDto` in a value position is the zod object, in a type position the inferred
  shape).
* **The `User*` schemas describe better-auth's payloads, not a `user` table.** Sign-up and
  sign-in are handled by better-auth on the backend; these schemas exist to type the
  client's forms, which is why they carry `callbackURL` and `rememberMe`. The `user`,
  `session`, `account` and `verification` tables are owned by better-auth and have no
  schema here.
* **`UserRoles` is the one piece of shared logic**, not just shape: the backend gates
  `/settings` on `UserRoles.Admin` and the client hides the configuration route and the
  API-docs link the same way.

### ValidateSchema

```ts
ValidateSchema<SteamAppDto>(response, SteamAppSchema)        // one object
ValidateSchema<SteamAppDto>(response, SteamAppSchema, true)  // an array of them
```

A thin wrapper over `safeParse` that **throws** `Error("Invalid data: ...")` on failure
instead of returning a result union, and logs the zod error to the console on the way out.
The overloads make the third argument switch the return type between `T` and `T[]`.

The `T` type parameter is asserted, not checked against the schema —
`ValidateSchema<SettingDto>(x, SteamAppSchema)` compiles. Pass the DTO that matches the
schema.

Both consumers call it at their boundary, so a payload that drifts from its DTO fails
loudly at the edge rather than surfacing as `undefined` three layers deep. Note that the
backend applies it unevenly — see its README.

## Adding or changing a schema

1. Edit or add the file under `src/schemas/`.
2. Export it from [src/index.ts](src/index.ts) if the file is new — this is manual, and a
   schema that is not re-exported is invisible from the package root.
3. `npm run build`.
4. If the entity is backed by a table, keep `vtp-backend/prisma/schema.prisma` in step and
   create a migration there.
5. If the endpoint is documented, update the matching component schema in
   `vtp-backend/src/config/swagger.ts`; the OpenAPI definitions mirror these by hand and
   do not update themselves.

Removing an export is the case to be careful with: the consumers are linked by path, not
by version, so a deleted schema does not surface as a failed install. It surfaces as a
broken import the next time something typechecks — run `npx tsc --noEmit` in `vtp-backend`
and `npx tsc -b` in `vtp-front` after any removal.