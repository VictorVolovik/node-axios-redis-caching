# Simple Redis cache in Node.js using axios-cache-adapter example

## Prerequisites

Node.js >= 12

NPM >= 6

Redis >= 6

## Installation

1. Install dependencies

   ```bash
   npm install
   ```

1. Create `.env` file in the root of the project using `.default_env` as example

1. Start project

   ```bash
   npm start
   ```

   for dev mode

   ```bash
   npm run dev
   ```

## Usage

Visit /repos_number/VictorVolovik

For force clear cache visit /repos_number/VictorVolovik?clearCache=true

Check reposnse time in DevTools -> Network

Change `debug: false` to `debug: true` in cache setup for cache hit/miss info.
