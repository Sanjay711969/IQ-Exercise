import React, { Component } from 'react';
import Dice from './Dice';
import ScoreTable from './ScoreTable';
import './Game.css';

const NUM_DICE = 5;
const NUM_ROLLS = 3;
let currscore = 0;
let rocking = false;

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dice: Array(NUM_DICE).fill(6),
      locked: Array(NUM_DICE).fill(false),
      rollsLeft: NUM_ROLLS,
      rolling: false,
      rules: 13,
      maxScore: 0,

      scores: {
        ones: undefined,
        twos: undefined,
        threes: undefined,
        fours: undefined,
        fives: undefined,
        sixes: undefined,
        threeOfKind: undefined,
        fourOfKind: undefined,
        fullHouse: undefined,
        smallStraight: undefined,
        largeStraight: undefined,
        yahtzee: undefined,
        chance: undefined,
      },
    };
    console.log(this.state);
    this.roll = this.roll.bind(this);
    this.doScore = this.doScore.bind(this);
    this.toggleLocked = this.toggleLocked.bind(this);
    this.animateRoll = this.animateRoll.bind(this);
    this.updateMax = this.updateMax.bind(this);
    this.Restart = this.Restart.bind(this);
  }
  componentDidMount() {
    this.animateRoll();
  }
  updateMax(score) {
    currscore = score;
    if (this.state.maxScore < score) {
      rocking = true;
      this.setState({ maxScore: score });
    }
  }

  animateRoll() {
    this.setState({ rolling: true }, () => {
      setTimeout(this.roll, 1000);
    });
  }

  roll(evt) {
    // roll dice whose indexes are in
    console.log('roll');
    this.setState((st) => ({
      dice: st.dice.map((d, i) =>
        st.locked[i] ? d : Math.ceil(Math.random() * 6)
      ),
      locked: st.rollsLeft > 1 ? st.locked : Array(NUM_DICE).fill(true),
      rollsLeft: st.rollsLeft - 1,
      rolling: false,
    }));
  }

  toggleLocked(idx) {
    // toggle whether idx is in locked or not
    if (this.state.rollsLeft > 0 && !this.state.rolling) {
      this.setState((st) => ({
        locked: [
          ...st.locked.slice(0, idx),
          !st.locked[idx],
          ...st.locked.slice(idx + 1),
        ],
      }));
    }
  }

  doScore(rulename, ruleFn) {
    // evaluate this ruleFn with the dice and score this rulename
    this.setState((st) => ({
      scores: { ...st.scores, [rulename]: ruleFn(this.state.dice) },
      rollsLeft: NUM_ROLLS,
      locked: Array(NUM_DICE).fill(false),
      rules: st.rules - 1,
    }));

    this.animateRoll();
  }

  displayRollInfo() {
    const messages = [
      '0 Rolls Left',
      '1 Roll Left',
      '2 Rolls Left',
      'Starting Round',
    ];
    return messages[this.state.rollsLeft];
  }

  Restart() {
    rocking = false;
    this.setState(() => ({
      dice: Array.from({ length: NUM_DICE }),
      locked: Array(NUM_DICE).fill(false),
      rollsLeft: NUM_ROLLS,
      rolling: false,
      rules: 13,
      scores: {
        ones: undefined,
        twos: undefined,
        threes: undefined,
        fours: undefined,
        fives: undefined,
        sixes: undefined,
        threeOfKind: undefined,
        fourOfKind: undefined,
        fullHouse: undefined,
        smallStraight: undefined,
        largeStraight: undefined,
        yahtzee: undefined,
        chance: undefined,
      },
    }));
  }
  render() {
    console.log(this.state.maxScore, 'game');
    const { dice, locked, rollsLeft, rolling, scores } = this.state;
    return (
      <div className='Game'>
        {this.state.rules > 0 ? (
          <>
            <header className='Game-header'>
              <h4 className='App-title'>
                <span className='neon-orange'>Puzzler</span>
              </h4>
              <section className='Game-dice-section'>
                <Dice
                  dice={dice}
                  locked={locked}
                  handleClick={this.toggleLocked}
                  disabled={rollsLeft === 0}
                  rolling={rolling}
                />
                <div className='Game-button-wrapper'>
                  <button
                    className='Game-reroll'
                    disabled={
                      locked.every((x) => x) || rollsLeft === 0 || rolling
                    }
                    onClick={this.animateRoll}
                  >
                    {this.displayRollInfo()}
                  </button>
                </div>
              </section>
            </header>
            {rocking ? (
              <div style={{ margin: '0px 0px -20px 0px' }}>
                <h2 className='neon-orange'>
                  you are <span className='neon-blue'>rocking:🔥🔥🔥</span>
                </h2>
                <br/>
                <h2 className='neon-blue'>
                  New Max{' '}
                  <span className='neon-orange'>
                    {' '}
                    Score {this.state.maxScore}{' '}
                  </span>
                </h2>
              </div>
            ) : (
              <h2>
                <span className='neon-orange'>Max</span>
                <span className='neon-blue'>Score : </span>{' '}
                {this.state.maxScore}
              </h2>
            )}
            <ScoreTable
              doScore={this.doScore}
              scores={scores}
              updateMax={this.updateMax}
            />
          </>
        ) : (
          <div className='Restart-page'>
            <h2>
              {' '}
              <span className='neon-orange'>MAX SCORE: </span>{' '}
              <span className='neon-blue'> {this.state.maxScore}</span>
            </h2>
            <h2>
              {' '}
              <span className='neon-blue'>Current Score: </span>{' '}
              <span className='neon-orange'>{currscore}</span>
            </h2>
            <button className='Restart' onClick={this.Restart}>
              Practice Again
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default Game;
