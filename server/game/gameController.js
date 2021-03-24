
const addScore = async (req, res) => {
    //take user id, game, and score and add to the results table.
    const {game_id} = req.params;
    const {score} = req.body;
    console.log(game_id, score);
    req.app.get('db').game.add_new_score([game_id, req.session.user.id, score])
    .then(_ => {
        return res.sendStatus(201);
    }).catch(err => {
        console.log(err);
        return res.sendStatus(500);
    });
}

const getScores = async (req, res) => {
    //send back scores based off of user id. Get all games from user, categorize them by what the game trains and send the total results back
    //find score from the previous week and see how it has changed recently.
    const results = await req.app.get('db').game.get_scores([req.session.user.id]);
    let final = [];
    const categories = [...new Set(results.map(el => el.category))];
    for(let i = 0;i<categories.length;i++)
    {
        const score = results.filter(el => el.category === categories[i]).reduce((total, curr) => { total += +curr.score}, 0)/results.filter(el => el.category === categories[i]).length;
        final.push({category: categories[i], averageScore: score});
    }
    return res.status(200).send(final);
}

const getScoresDateRange = async (req, res) => {
    //find scores for a specific range of dates. Not needed currently, but may want to add in future updates.
}

const compareScores = async (req, res) => {
    //get tally of all scores to see how user stacks up.
}

const getGames = async (req, res) => {
    console.log('get games');
    let db = req.app.get('db');
    const games = await db.game.get_games();
    console.log(games);
    if(games)
    {
        return res.status(200).send(games);
    } else {
        return res.status(404).send('no games');
    }
    
}

const getCategories = (req, res) => {
    req.app.get('db').game.get_categories().then(r => {
        console.log(r);
        return res.status(200).send(r);
    }).catch(err => {
        res.sendStatus(500);
        console.log(err);
    })
}

const getRecommendedGames = async (req, res) => {
    let db = req.app.get('db');
    //get average scores per category
    let results = await db.game.get_scores([req.session.user.id]);
    let final = [];
    const categories = await db.game.get_categories();
    for(let i = 0;i<categories.length;i++)
    {
        let score = results.filter(el => el.category === categories[i]).reduce((total, curr) => { total += +curr.score}, 0)/results.filter(el => el.category === categories[i]).length;
        final.push({category: categories[i].category, averageScore: score});
    }
    //sort scores
    console.log(final)

    //get games
    const games = await db.game.get_games();
    console.log('games', games)
    //sort games into array by category
    let catGameCombo = {test: ''};
    for(let i = 0;i<categories.length;i++)
    {
        catGameCombo[categories[i].category] = games.filter(el => el.category === categories[i].category);
    }
    console.log('combos', final);
    //get one game per 3 lowest categories and send it
    console.log(catGameCombo)
    let game1 = catGameCombo[final[0].category][Math.floor(Math.random() * catGameCombo[final[0].category].length)]
    let game2 = catGameCombo[final[1].category][Math.floor(Math.random() * catGameCombo[final[1].category].length)]
    let game3 = catGameCombo[final[2].category][Math.floor(Math.random() * catGameCombo[final[2].category].length)]

    return res.status(200).send([game1, game2, game3]);
}

// const sort = (arr) => {
//     if(!arr.length) return [];
//     let len = arr.length;
//     for (let i = len-1; i>=0; i--){
//         for(let j = 1; j<=i; j++){
//             if(arr[j-1]>arr[j]){
//                 var temp = arr[j-1];
//                 arr[j-1] = arr[j];
//                 arr[j] = temp;
//             }
//         }
//     }
//     return arr;
// }


module.exports = {
    addScore,
    getScores,
    compareScores,
    getScoresDateRange,
    getGames,
    getCategories,
    getRecommendedGames
}