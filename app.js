const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/tft-rank', async (req, res) => {
  const { user, tag, region } = req.query;
  const apiKey = process.env.RIOT_API_KEY;

  try {
    // Step 1: Get PUUID
    const accountRes = await axios.get(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${user}/${tag}?api_key=${apiKey}`
    );
    const puuid = accountRes.data.puuid;

    // Step 2: Get rank data
    const summonerRes = await axios.get(
      `https://${region}.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${puuid}?api_key=${apiKey}`
    );
    const summonerId = summonerRes.data.id;

    const rankedRes = await axios.get(
      `https://${region}.api.riotgames.com/tft/league/v1/entries/by-summoner/${summonerId}?api_key=${apiKey}`
    );

    const ranked = rankedRes.data.find(entry => entry.queueType === "RANKED_TFT");

    if (!ranked) return res.send(`No ranked data found.`);

    const result = `${ranked.tier} ${ranked.rank} - ${ranked.leaguePoints} LP`;
    res.send(result);
  } catch (err) {
    res.send("Error fetching rank. Check your inputs.");
  }
});

app.get('/riot.txt', (req, res) => {
  res.type('text/plain');
  res.send('ecb8824f-fc4b-4da3-8a11-99d7cd5e4247');
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
