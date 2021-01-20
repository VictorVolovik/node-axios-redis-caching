const dotenv = require("dotenv");
const express = require("express");
const axios = require("axios");
const { setup, RedisStore  } = require('axios-cache-adapter');
const redis = require("redis");

dotenv.config();

const PORT = parseInt(process.env.PORT, 10) || 5000;
const REDIS_PORT = parseInt(process.env.REDIS_PORT, 10) || 6379;

const API_GET_GITHUB_USER = username => `https://api.github.com/users/${username}`;
const CACHE_LIFETIME = 1000 * 60 * 5; // 5 minutes

const app = express();

const redisClient = redis.createClient({
  host: "127.0.0.1", // localhost
  port: REDIS_PORT
});

const store = new RedisStore(redisClient);

const apiWithCahe = setup({
  cache: {
    debug: false,
    maxAge: CACHE_LIFETIME,
    store,
    invalidate: async (config, request) => {
      if (request.clearCache) {
        await config.store.removeItem(config.uuid)
      }
    }
  }
})

// Request data from GitHub
async function getReposNum (req, res, next) {
  try {
    console.log("Fetching data...");

    const { username } = req.params;
    const { clearCache } = req.query;

    const response = await apiWithCahe.get(API_GET_GITHUB_USER(username), { clearCache })
    const { public_repos: reposNum } = response.data;

    redisClient.setex(username, CACHE_LIFETIME, reposNum);

    res.send(`<h2>${username} has ${reposNum} public repositories.</h2>`);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

app.get("/repos_number/:username", getReposNum);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
})
