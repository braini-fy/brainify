import {Switch, Route} from 'react-router-dom';
import SpeedMatch from './Speed/SpeedMatch';
import MathDrop from './MathDrop/MathDrop';
import {useContext} from 'react';
import {GameContext} from '../../context/GameContext';

const GameLoader = (props) => {

    const gameContext = useContext(GameContext);

    return <div className="game">
        <Switch>
            <Route path='/game/mathdrop' component={MathDrop} />
            <Route path='/game/speedmatch'><SpeedMatch game_id={gameContext.game.game_id} game_name={gameContext.game.game_name} /></Route>
        </Switch>
    </div>
}

export default GameLoader;