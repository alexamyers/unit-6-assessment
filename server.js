const express = require('express')
const path = require('path')
const app = express()
const {bots, playerRecord} = require('./data')
const {shuffleArray} = require('./utils')

var Rollbar = require("rollbar");
var rollbar = new Rollbar({
  accessToken: '20d85e4fb81e41238ad70ac1ba612e77',
  captureUncaught: true,
  captureUnhandledRejections: true
});

rollbar.log("Hello world!");

app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});


app.get('/api/robots', (req, res) => {
    try {
        rollbar.info('User was able to view robots array successfully', {author: "Alex", type: "Manual click"});
        res.status(200).send(bots)
    } catch (error) {
        rollbar.error('User was not able to view robots array successfully due to error');
        console.log('ERROR GETTING BOTS', error)
        res.sendStatus(400)
    }
})

app.get('/api/robots/five', (req, res) => {
    try {
        rollbar.info('User was able to view a selection of 5 bots to choose for their duo');
        let shuffled = shuffleArray(bots)
        let choices = shuffled.slice(0, 5)
        let compDuo = shuffled.slice(6, 8)
        res.status(200).send({choices, compDuo})
    } catch (error) {
        rollbar.log('User was not able to view selection of 5 bots to choose for their duo due to error');
        console.log('ERROR GETTING FIVE BOTS', error)
        res.sendStatus(400)
    }
})

app.post('/api/duel', (req, res) => {
    try {
        rollbar.info('User was able to engage in duel');
        // getting the duos from the front end
        let {compDuo, playerDuo} = req.body

        // adding up the computer player's total health and attack damage
        let compHealth = compDuo[0].health + compDuo[1].health
        let compAttack = compDuo[0].attacks[0].damage + compDuo[0].attacks[1].damage + compDuo[1].attacks[0].damage + compDuo[1].attacks[1].damage
        
        // adding up the player's total health and attack damage
        let playerHealth = playerDuo[0].health + playerDuo[1].health
        let playerAttack = playerDuo[0].attacks[0].damage + playerDuo[0].attacks[1].damage + playerDuo[1].attacks[0].damage + playerDuo[1].attacks[1].damage
        
        // calculating how much health is left after the attacks on each other
        let compHealthAfterAttack = compHealth - playerAttack
        let playerHealthAfterAttack = playerHealth - compAttack

        // comparing the total health to determine a winner
        if (compHealthAfterAttack > playerHealthAfterAttack) {
            playerRecord.losses++
            rollbar.info('User was able to engage in duel and lost to PC');
            res.status(200).send('You lost!')
        } else {
            playerRecord.losses++
            rollbar.info('User was able to engage in duel and won against PC');
            res.status(200).send('You won!')
        }
    } catch (error) {
        rollbar.log('User was not able to engage in duel due to error')
        console.log('ERROR DUELING', error)
        res.sendStatus(400)
    }
})

app.get('/api/player', (req, res) => {
    try {
        rollbar.info('User was able to record their score against PC')
        res.status(200).send(playerRecord)
    } catch (error) {
        rollbar.log('User was unable to record their score against PC due to error')
        console.log('ERROR GETTING PLAYER STATS', error)
        res.sendStatus(400)
    }
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})