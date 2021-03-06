import {useState, useEffect, useRef, useContext} from 'react'
import Equation from './Equation'
import CountDown from '../Modal/CountDown';
import axios from 'axios'
import { GameContext } from '../../../context/GameContext'
import {v4 as uuidv4} from 'uuid';

const MathDrop = () => {
    const [userAnswer, setUserAnswer] = useState('')
    const [score, setScore] = useState(0)
    const [lives, setLives] = useState(0)
    const [equations, setEquations] = useState([])
    const [consecutive, setConsecutive] = useState(1)
    const [gameStart, setGameStart] = useState(false);
    const [countdown, setCountdown] = useState(false)
    // const id = useRef(0)
    const equationTimer = useRef()
    const gameContext = useContext(GameContext)

    useEffect(() => {
        return(()=>{clearInterval(equationTimer.current)})
    }, [])

    useEffect(() => {
        if(lives===0){
            //will end game and send score to the server.
            setEquations([])
            clearInterval(equationTimer.current) 
            axios.post(`/api/score/${gameContext.game.game_id}`, {score})
                .then(_=>{
                    
                })
                .catch(err=>console.log(err))
        }
    }, [lives])
    
    const generateProblem=()=>{
        let numOne=Math.floor(Math.random()*(11))
        let numTwo=Math.floor(Math.random()*(11))
        let operatorSelector=Math.floor(Math.random()*(2+1))
        let altOperator=['+', '-', 'X'][operatorSelector]
        // id.current = id.current+1
        // console.log(id.current);
        setEquations((e)=>[...e, {numOne, numTwo, altOperator, i: uuidv4()}])
    }

    const checkAnswer=(event)=>{
        if(event.key==='Enter' || event.code==='Enter'){
            let indexArr = []
            for(let i=0; i<equations.length; i++){
                switch(equations[i].altOperator){
                    case '+':
                        if(equations[i].numOne + equations[i].numTwo == userAnswer){
                            //creates different array of index to remove from the equations.
                            indexArr.push(i)
                            setScore(score + (consecutive+1) *50)
                            setConsecutive(consecutive+1)
                        } 
                        break
                    case '-':
                        if(equations[i].numOne - equations[i].numTwo == userAnswer){
                            //creates different array of index to remove from the equations.
                            indexArr.push(i)
                            setScore(score + (consecutive+1) *50)
                            setConsecutive(consecutive+1)
                        } 
                        break
                    case 'X':
                        if(equations[i].numOne * equations[i].numTwo == userAnswer){
                            //creates different array of index to remove from the equations.
                            indexArr.push(i)
                            setConsecutive(consecutive+1)
                            setScore(score + (consecutive+1) *100)
                        } 
                        break
                    default:
                        break
                }
            } 
            let tempArr = equations.slice()
            for(let i=indexArr.length-1; i>=0; i--){
                tempArr.splice(indexArr[i], 1)
            }
            setEquations(tempArr)
            setUserAnswer('')
        }
    }

    const missedTarget=()=>{
        setLives(e=>{
            console.log(e-1)
            return e-1
        })
        setEquations([])
    }

    const playGame=()=>{
        // id.current = 0
        setLives(3);
        setScore(0);
        setCountdown(false);
        setGameStart(true);
        equationTimer.current = setInterval(()=>{
            generateProblem()
        },2000)
    }

    return (
        <div className='gameDisplay'>
            <section className='game-stats'>
                <h1 className='hub'>Score: {score}</h1>
                <h1 className='hub'>Lives: {lives}</h1>  
            </section>
            <div className='centerGame'>
                <div className='game-container'>
                    {!gameStart ? <div className='startNewGame'>
                        {countdown && <CountDown time={3} play={playGame} />}
                        <h1 className='gameTitle'>Math Drop!</h1>
                        <p className='gameInstructions'> Enter your answers before the bubbles reach the bottom. Type the answer to the equation into the box at the bottowm of the screen and press enter to submit your answer. You have three lives! how long can you last?</p>
                        <button className='playBtn' onClick={_=>{setCountdown(true)}}>Play</button>
                    </div>
                    : lives>0 ? <div className='mathdropGame'>
                        {equations.map((equation, index)=>{
                            //get 6, 9 or 12
                            return(<Equation className='displayEquations' key={equation.i} missedTarget={missedTarget} numOne={equation.numOne} numTwo={equation.numTwo} altOperator={equation.altOperator} />)
                        })}
                        <input className='user-answer' autoFocus value={userAnswer} onKeyPress={checkAnswer} onChange={(e)=>{setUserAnswer(e.target.value)}}/>
                    </div>
                    : <div className="final-score"> 
                        <h1>Game Over!</h1> 
                        <h1>Final Score: {score}</h1>
                        <button onClick={_ =>{setGameStart(false); setCountdown(true)}}>
                            Play Again
                        </button>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default MathDrop