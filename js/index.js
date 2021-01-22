$(document).ready(function () {
  function TicTacToe(ele, size) {
    this.$ele = ele;
    this.o_win = 0;
    this.x_win = 0;
    this.x = "X"
    this.o = "O"
    this.winCallBack = [];
    this.setSize(size);
    this.initGameData();
    this.genGameBoard();
  };

  TicTacToe.prototype.setSize = function (size) {
    this.size = (size < 3 ? 3 : size) || 3;
  };

  TicTacToe.prototype.changeSize = function (size) {
    this.setSize(size);
    this.initGameData();
    this.genGameBoard();
  };

  TicTacToe.prototype.initGameData = function () {
    this.count = 0;
    this.winner = null;
    this.max = Math.pow(this.size, 2);
    this.gameData = new Array(this.size)
      .fill(null)
      .map(() => {
        return new Array(this.size).fill(null);
      });
  };

  TicTacToe.prototype.genGameBoard = function () {
    const $ele = $(`<div id="game"/>`);
    this.$ele.replaceWith($ele);
    this.$ele = $ele;
    this.gameData.forEach((row, i) => {
      const $row = $(`<div></div>`);
      row.forEach((col, j) => {
        const $col = $(`<div class="btn game-block" id="${i}-${j}" >+</div>`);
        $col.appendTo($row);
      });
      $row.appendTo(this.$ele);
    });
    $ele.on('click', (event) => {
      if (!$(event.target).hasClass('game-block')) return;
      const [row, col] = event.target.id.split('-');
      this.onClickBlock(row, col);
    })
  };

  TicTacToe.prototype.onClickBlock = function (x, y) {
    if (this.winner !== null) return alert(`${this.winner} has won the game. Start a new game`);
    if (this.gameData[x][y] !== null) return alert('Already selected');
    const $target = $(`#${x}-${y}`);
    this.gameData[x][y] = this.count % 2 === 0 ? this.o : this.x;
    $target
      .addClass(this.gameData[x][y] === this.o ? 'btn-primary disable' : 'btn-info disable')
      .text(this.gameData[x][y]);
    this.count++;
    this.calculateWinner(x, y);
  };

  TicTacToe.prototype.calculateWinner = function (x, y) {
    const row = Number(x);
    const col = Number(y);
    const directions = [
      [[-1, 0], [1, 0]],
      [[0, -1], [0, 1]],
      [[-1, -1], [1, 1]],
      [[1, -1], [-1, 1]],
    ]
    const lastClick = this.gameData[x][y];
    const move = (x, y, direction, record) => () => {
      x += direction[0];
      y += direction[1];
      if (x < 0 || x >= this.size || y < 0 || y >= this.size) return undefined;
      record.count++;
      return this.gameData[x][y];
    };
    const hasWinner = directions.some(direction => {
      const record = {
        count: 1,
        flag: true,
      };
      const getLeft = move(row, col, direction[0], record);
      const getRight = move(row, col, direction[1], record);
      let left = getLeft();
      let right = getRight();
      while (left !== undefined || right !== undefined) {
        if (
          (left !== undefined && left !== lastClick)
          || (right !== undefined && right !== lastClick)
        ) {
          record.flag = false;
          break;
        }
        if (left) {
          left = getLeft();
        }
        if (right) {
          right = getRight();
        }
      }
      return record.flag && record.count === this.size;
    });
    if (hasWinner) {
      this.winner = lastClick;
      if (this.winner === this.o) {
        this.o_win++;
      } else {
        this.x_win++;
      }
      this.winCallBack.forEach(cb => cb(this.winner));
      return alert(`${this.winner} wins`);
    }
    if (this.count === this.max) alert('Its a tie. It will restart.');
  };

  TicTacToe.prototype.reset = function () {
    this.initGameData();
    $('.game-block')
      .removeClass('btn-primary disable btn-info')
      .text('+');
  };

  TicTacToe.prototype.onWin = function (cb) {
    this.winCallBack.push(cb);
  };

  const $oScore = $('#o_win');
  const $xScore = $('#x_win');
  const $gameSize = $('#game-size');
  const tic = new TicTacToe($('#game'), Number($gameSize.val()));


  tic.onWin(winner => {
    const $target = winner === 'O' ? $oScore : $xScore;
    const val = winner === 'O' ? tic.o_win : tic.x_win;
    $target.text(val);
  });

  $('#reset').on('click', () => tic.reset());
  $gameSize.on('change', () => {
    const val = $gameSize.val();
    tic.changeSize(Number(val));
  })
});