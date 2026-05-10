# Changelog

## v1.0.0

[compare changes](https://github.com/Hrdtr/litetics/compare/v1.0.0-rc.15...v1.0.0)

### 🚀 Enhancements

- ⚠️  Single export entrypoint ([f23fd17](https://github.com/Hrdtr/litetics/commit/f23fd17))
- ⚠️  Tracker runtime adapter, handler middleware, swappable parsers ([128c570](https://github.com/Hrdtr/litetics/commit/128c570))
- ⚠️  Additional utm params & add properties generic on event data ([e381d7f](https://github.com/Hrdtr/litetics/commit/e381d7f))
- Playground & integration test ([09a9152](https://github.com/Hrdtr/litetics/commit/09a9152))
- Redesign public API and adapter interface ([1e8fc1d](https://github.com/Hrdtr/litetics/commit/1e8fc1d))
- **docs:** Add vitepress-plugin-llms and page descriptions ([cad1712](https://github.com/Hrdtr/litetics/commit/cad1712))

### 🩹 Fixes

- Missing session timeout implementation ([6c35614](https://github.com/Hrdtr/litetics/commit/6c35614))
- Potential crash on missing body.u ([b1456b1](https://github.com/Hrdtr/litetics/commit/b1456b1))
- **test:** Unreliable tracker tests due, add more cases ([5ef85b2](https://github.com/Hrdtr/litetics/commit/5ef85b2))
- Tracker relies on global `location` without guard ([0dbb4e8](https://github.com/Hrdtr/litetics/commit/0dbb4e8))
- Code style & patterns ([ce7046f](https://github.com/Hrdtr/litetics/commit/ce7046f))
- Inefficient country code lookup ([dfcb6b3](https://github.com/Hrdtr/litetics/commit/dfcb6b3))
- Resolve issues in tracking and utilities ([ad19264](https://github.com/Hrdtr/litetics/commit/ad19264))
- CreateBrowserAdapter re-wraps history on every call ([72d14bc](https://github.com/Hrdtr/litetics/commit/72d14bc))
- CreateBrowserAdapter mutates global history permanently ([8b74443](https://github.com/Hrdtr/litetics/commit/8b74443))
- Drop unreleased middleware feature ([0074de1](https://github.com/Hrdtr/litetics/commit/0074de1))
- **tracker:** Unload using a one-time guard ([7677035](https://github.com/Hrdtr/litetics/commit/7677035))
- Add input validation and fix listener cleanup ([a4ff577](https://github.com/Hrdtr/litetics/commit/a4ff577))
- Consolidate unload payload validation and logging ([67f4c86](https://github.com/Hrdtr/litetics/commit/67f4c86))

### 💅 Refactors

- ⚠️  Flatten parse types and add fetchMode ([6371a70](https://github.com/Hrdtr/litetics/commit/6371a70))

### 📖 Documentation

- Mark plain code blocks as text ([8bf1ec6](https://github.com/Hrdtr/litetics/commit/8bf1ec6))

### 🏡 Chore

- Bittle event data assertions, configurable debug log ([c609f31](https://github.com/Hrdtr/litetics/commit/c609f31))
- Fix docs formatting and remove unused import ([af32b27](https://github.com/Hrdtr/litetics/commit/af32b27))

### ✅ Tests

- Correct test description for time zone test ([a315de4](https://github.com/Hrdtr/litetics/commit/a315de4))
- Add mock and global state cleanup ([545dc52](https://github.com/Hrdtr/litetics/commit/545dc52))

#### ⚠️ Breaking Changes

- ⚠️  Single export entrypoint ([f23fd17](https://github.com/Hrdtr/litetics/commit/f23fd17))
- ⚠️  Tracker runtime adapter, handler middleware, swappable parsers ([128c570](https://github.com/Hrdtr/litetics/commit/128c570))
- ⚠️  Additional utm params & add properties generic on event data ([e381d7f](https://github.com/Hrdtr/litetics/commit/e381d7f))
- ⚠️  Flatten parse types and add fetchMode ([6371a70](https://github.com/Hrdtr/litetics/commit/6371a70))

### ❤️ Contributors

- Herdi Tr. <iam@icm.hrdtr.dev>

## v1.0.0-rc.15

[compare changes](https://github.com/Hrdtr/litetics/compare/v1.0.0-rc.14...v1.0.0-rc.15)

### 🩹 Fixes

- **tracker:** Remove problematic inactive session substraction ([8c7a8e3](https://github.com/Hrdtr/litetics/commit/8c7a8e3))

### 🏡 Chore

- Deps update ([f48ed5a](https://github.com/Hrdtr/litetics/commit/f48ed5a))

### ❤️ Contributors

- Herdi Tr ([@Hrdtr](https://github.com/Hrdtr))

## v1.0.0-rc.14

[compare changes](https://github.com/Hrdtr/litetics/compare/v1.0.0-rc.13...v1.0.0-rc.14)

### 🩹 Fixes

- **tracker:** Change track endpoint option key ([a6a04ed](https://github.com/Hrdtr/litetics/commit/a6a04ed))

### ❤️ Contributors

- Herdi Tr ([@Hrdtr](https://github.com/Hrdtr))

## v1.0.0-rc.13

[compare changes](https://github.com/Hrdtr/litetics/compare/v1.0.0-rc.12...v1.0.0-rc.13)

### 💅 Refactors

- ⚠️ Handler apis & replace ua-parser-js with my-ua-parser ([d9a88f6](https://github.com/Hrdtr/litetics/commit/d9a88f6))

### 🏡 Chore

- **tracker:** Remove console logs ([cda950f](https://github.com/Hrdtr/litetics/commit/cda950f))
- Update referrers & country timezones data ([2ccbc6e](https://github.com/Hrdtr/litetics/commit/2ccbc6e))

#### ⚠️ Breaking Changes

- ⚠️ Handler apis & replace ua-parser-js with my-ua-parser ([d9a88f6](https://github.com/Hrdtr/litetics/commit/d9a88f6))

### ❤️ Contributors

- Herdi Tr ([@Hrdtr](https://github.com/Hrdtr))

## v1.0.0-rc.12

[compare changes](https://github.com/Hrdtr/litetics/compare/v1.0.0-rc.11...v1.0.0-rc.12)

### 🚀 Enhancements

- Add session timeout option ([f1741cd](https://github.com/Hrdtr/litetics/commit/f1741cd))

### 🩹 Fixes

- Cache non-unique user ping response ([94e500b](https://github.com/Hrdtr/litetics/commit/94e500b))

### 🏡 Chore

- Deps update ([1e6297f](https://github.com/Hrdtr/litetics/commit/1e6297f))

### ✅ Tests

- Increase coverage ([5536cc2](https://github.com/Hrdtr/litetics/commit/5536cc2))

### ❤️ Contributors

- Herdi Tr. ([@Hrdtr](http://github.com/Hrdtr))

## v1.0.0-rc.11

[compare changes](https://github.com/Hrdtr/litetics/compare/v1.0.0-rc.10...v1.0.0-rc.11)

### 🩹 Fixes

- Include received time ([17d8aef](https://github.com/Hrdtr/litetics/commit/17d8aef))

### ❤️ Contributors

- Herdi Tr. ([@Hrdtr](http://github.com/Hrdtr))

## v1.0.0-rc.10

[compare changes](https://github.com/Hrdtr/litetics/compare/v1.0.0-rc.9...v1.0.0-rc.10)

### 🩹 Fixes

- **handler:** Hit should also return the url query string ([7f56f7b](https://github.com/Hrdtr/litetics/commit/7f56f7b))

### ❤️ Contributors

- Herdi Tr. ([@Hrdtr](http://github.com/Hrdtr))

## v1.0.0-rc.9

[compare changes](https://github.com/Hrdtr/litetics/compare/v1.0.0-rc.8...v1.0.0-rc.9)

### 🩹 Fixes

- Wrong event data referrer known type ([6c21139](https://github.com/Hrdtr/litetics/commit/6c21139))

### ❤️ Contributors

- Herdi Tr. ([@Hrdtr](http://github.com/Hrdtr))

## v1.0.0-rc.8

[compare changes](https://github.com/Hrdtr/litetics/compare/v1.0.0-rc.7...v1.0.0-rc.8)

### 💅 Refactors

- Event data type ([46176b7](https://github.com/Hrdtr/litetics/commit/46176b7))

### 📖 Documentation

- Add docstring comments ([18b79dc](https://github.com/Hrdtr/litetics/commit/18b79dc))

### ❤️ Contributors

- Herdi Tr. ([@Hrdtr](http://github.com/Hrdtr))

## v1.0.0-rc.7

[compare changes](https://github.com/Hrdtr/litetics/compare/v1.0.0-rc.6...v1.0.0-rc.7)

### 🏡 Chore

- **handler:** Improve hit result types ([44c87cc](https://github.com/Hrdtr/litetics/commit/44c87cc))

### ❤️ Contributors

- Herdi Tr. ([@Hrdtr](http://github.com/Hrdtr))

## v1.0.0-rc.6

[compare changes](https://github.com/Hrdtr/litetics/compare/v1.0.0-rc.5...v1.0.0-rc.6)

### 💅 Refactors

- Rename hit result key type to event ([a2d958b](https://github.com/Hrdtr/litetics/commit/a2d958b))

### ❤️ Contributors

- Herdi Tr. ([@Hrdtr](http://github.com/Hrdtr))

## v1.0.0-rc.5

[compare changes](https://github.com/Hrdtr/litetics/compare/v1.0.0-rc.4...v1.0.0-rc.5)

### 🚀 Enhancements

- Accept custom event type and its additional data ([195cb4a](https://github.com/Hrdtr/litetics/commit/195cb4a))

### 💅 Refactors

- Use single data type output ([20a232d](https://github.com/Hrdtr/litetics/commit/20a232d))

### ❤️ Contributors

- Herdi Tr. ([@Hrdtr](http://github.com/Hrdtr))

## v1.0.0-rc.4

[compare changes](https://github.com/Hrdtr/litetics/compare/v1.0.0-rc.3...v1.0.0-rc.4)

### 🩹 Fixes

- **tracker:** Wrap history function ([a6d8d0b](https://github.com/Hrdtr/litetics/commit/a6d8d0b))

### 🏡 Chore

- **tracker:** Use mapped object instead of enum for exported event types ([07e39f6](https://github.com/Hrdtr/litetics/commit/07e39f6))

### ❤️ Contributors

- Herdi Tr. ([@Hrdtr](http://github.com/Hrdtr))

## v1.0.0-rc.3

[compare changes](https://github.com/Hrdtr/litetics/compare/v1.0.0-rc.2...v1.0.0-rc.3)

### 🩹 Fixes

- **handler:** Hit should try to parse request body to json ([3e21fa3](https://github.com/Hrdtr/litetics/commit/3e21fa3))

### ❤️ Contributors

- Herdi Tr. ([@Hrdtr](http://github.com/Hrdtr))

## v1.0.0-rc.2

[compare changes](https://github.com/Hrdtr/litetics/compare/v1.0.0-rc.1...v1.0.0-rc.2)

### 💅 Refactors

- Ping result type ([d5beffc](https://github.com/Hrdtr/litetics/commit/d5beffc))

### ✅ Tests

- Update ping tests ([a9f0c9b](https://github.com/Hrdtr/litetics/commit/a9f0c9b))

### ❤️ Contributors

- Herdi Tr. ([@Hrdtr](http://github.com/Hrdtr))

## v1.0.0-rc.1

### 🏡 Chore

- Initial commit ([ef11eed](https://github.com/Hrdtr/litetics/commit/ef11eed))

### ❤️ Contributors

- Herdi Tr. ([@Hrdtr](http://github.com/Hrdtr))
