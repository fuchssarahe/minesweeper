const React = require('react'),
      ReactDOM = require('react-dom'),
      Minesweeper = require('./lib/game_logic.js');


const Game = React.createClass({
  getInitialState() {
    return ( {board: new Minesweeper.Board(10, 10), modalActive: false} );
  },

  updateGame(tile, flag) {
    if(flag){
      tile.toggleFlag();
    } else {
      tile.explore();
    }
    this.setState({board: this.state.board}, this.winLogic);
  },

  winLogic(){
    if (this.state.board.lost()){
      this.setState({modalActive: true});
    } else if (this.state.board.won()) {
      this.setState({modalActive: true});
    }
  },

  restartGame(){
    this.setState({board: new Minesweeper.Board(10, 10), modalActive: false});
  },

  render(){
    return (
      <div>
        <Modal modalActive={this.state.modalActive} restartGame={this.restartGame}/>
        <Board board={this.state.board} updateGame={this.updateGame}/>
      </div>
    );
  }
});

const Modal = React.createClass({

  render(){
    let modalClass = 'modal';
    if (this.props.modalActive) {
      modalClass += ' is-active';
    }
    return (
    <section id="modal" className={modalClass}>
      <article className="modal-content">

        <h1>Game Over!</h1>

        <p>Would you like to play again?</p>

        <button onClick={this.props.restartGame}>For sure!</button>
      </article>
      <div className="modal-screen"></div>
    </section>
    );
  }
});

const Board = React.createClass({
  render(){
    const grid = this.props.board.grid.map( (row, rowIdx)=>{
      return (
        <div key={rowIdx}>
          {row.map( (tile, colIdx) => {
            return (<Tile tileObject={tile} updateGame={this.props.updateGame} key={[rowIdx, colIdx]}/>);
          })}
        </div>
      );
    });

    return (
      <div id='grid'>{grid}</div>
    );
  }
});

const Tile = React.createClass({

  reveal(event){
    let flag = event.altKey;
    this.props.updateGame(this.props.tileObject, flag);
  },

  render(){
    let tileText = '';
    let tileClass = 'tile';
    const tile = this.props.tileObject;
    if (tile.bombed && tile.explored) {
      tileText = `💣`;
      tileClass += ' bombed';
    } else if (tile.explored) {
      tileClass += ' revealed';
      let count = tile.adjacentBombCount();
      tileText = count > 0 ? count : '';
    } else if (tile.flagged) {
      tileClass += ' flagged';
      tileText = '⚑';
    }
    return (<div className={tileClass} onClick={this.reveal}>{tileText}</div>);
  }
});

document.addEventListener('DOMContentLoaded', ()=>{
  ReactDOM.render(<Game/>, document.getElementById('root'));
});
