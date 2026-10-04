# vtp-common

The shared contract for **VTP** (Video Tracking and Planning): one zod schema per entity,
the TypeScript DTOs inferred from them, and the `ValidateSchema` helper both sides use to
enforce them.

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

> The `prebuild` and `preprepare` scripts are `if exist dist rmdir /s /q dist` — **cmd.exe
> syntax**. They fail on macOS and Linux. Only the clean step is affected: `tsc` still
> overwrites `dist/`, so a plain `npx tsc` works anywhere.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run build` | Clears `dist/` and compiles `src/` with `tsc` |
| `npm run prepare` | Same thing, run automatically by `npm install` |

There is no test script and no linter here.

## What it exports

Everything is re-exported from [src/index.ts](src/index.ts), so consumers import from the
package root:

```ts
import {type GameDto, GameSchema, ValidateSchema} from "@nct/vtp-common";
```

| Module | Schemas | DTOs |
| --- | --- | --- |
| [user.ts](src/schemas/user.ts) | `UserSchema` | `UserDto` |
| [game.ts](src/schemas/game.ts) | `CreateGameSchema`, `GameSchema` | `CreateGameDto`, `GameDto` |
| [game_info.ts](src/schemas/game_info.ts) | `CreateGameInfoSchema`, `GameInfoSchema` | `CreateGameInfoDto`, `GameInfoDto` |
| [game_with_info.ts](src/schemas/game_with_info.ts) | `GameWithInfoSchema` | `GameWithInfoDto` |
| [rank.ts](src/schemas/rank.ts) | `CreateRankSchema`, `RankSchema` | `CreateRankDto`, `RankDto` |
| [post.ts](src/schemas/post.ts) | `PostSchema` | `PostDto` |
| [post_information.ts](src/schemas/post_information.ts) | `CreatePostInformationSchema`, `PostInformationSchema` | `CreatePostInformationDto`, `PostInformationDto` |
| [channel_data.ts](src/schemas/channel_data.ts) | `ChannelDataSchema` | `ChannelDataDto` |
| [drop_down_data.ts](src/schemas/drop_down_data.ts) | `DropDownSchema` | `DropDownDto` |
| [setting.ts](src/schemas/setting.ts) | `SettingSchema` | `SettingDto` |
| [helpers/validators.ts](src/helpers/validators.ts) | — | `ValidateSchema()` |

### Conventions

* **`CreateXSchema` is the write shape, `XSchema` is the read shape.** The full schema
  spreads the create schema's `.shape` and adds the server-assigned fields — usually
  `id`, plus `import_date` on `PostInformationSchema`. Entities the client never creates
  (`User`, `Post`, `ChannelData`, `Setting`, `DropDown`) have a single schema.
* **DTOs are always `z.infer`**, never hand-written. Change the schema and the type
  follows.
* `GameWithInfoSchema` is the flattened join of `GameSchema` and `GameInfoSchema` plus the
  computed `game_score`; it backs `POST /games/with-info`.
* `DropDownSchema` carries a `.transform()` that derives a missing `key` as
  `type + '_' + value`. Because of that transform it is a `ZodEffects`, so `.shape` and
  `.extend()` are not available on it.

### ValidateSchema

```ts
ValidateSchema<GameDto>(response, GameSchema)        // one object
ValidateSchema<GameDto>(response, GameSchema, true)  // an array of them
```

A thin wrapper over `safeParse` that **throws** `Error("Invalid data: ...")` on failure
instead of returning a result union, and logs the zod error to the console on the way out.
The overloads make the third argument switch the return type between `T` and `T[]`.

The `T` type parameter is asserted, not checked against the schema — `ValidateSchema<UserDto>(x, GameSchema)`
compiles. Pass the DTO that matches the schema.

Both consumers call it at their boundary: the backend validates request bodies on the way
in and its own responses on the way out, the frontend validates every response it
receives. A payload that drifts from its DTO fails loudly at the edge rather than
surfacing as `undefined` three layers deep.

## Adding or changing a schema

1. Edit or add the file under `src/schemas/`.
2. Export it from [src/index.ts](src/index.ts) if the file is new — this is manual, and a
   schema that is not re-exported is invisible to both consumers.
3. `npm run build`.
4. Update the matching component schema in `vtp-backend/src/config/swagger.ts`; the
   OpenAPI definitions mirror these by hand and do not update themselves.

Removing an export is the case to be careful with: the consumers are linked by path, not
by version, so a deleted schema does not surface as a failed install. It surfaces as a
broken import the next time something typechecks. `CreateUserSchema` was removed this way
and `vtp-backend/src/routes/users.ts` still imports it.

## Publishing

`publishConfig.registry` points at GitHub Packages
(`https://npm.pkg.github.com`), and `files` limits the tarball to `dist/`. Neither sibling
repo consumes it that way today — both use the `file:` link — so bumping `version` (now
`0.2.1`) has no effect on them.
