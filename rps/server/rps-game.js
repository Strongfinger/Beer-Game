
class RpsGame {

  constructor(p1, p2,p3,p4) {
    this._players = [p1, p2,p3,p4];
    this._turns = [0, 0,0,0];
    this._role = ['Factory','Distributor','Wholesaler','Retailer']
    this._gameStat = {
      currentWeek : 0
    }
    var Factory = {
      role : 'Factory',
      stock : 12,
      order : 4,
      request : 4,
      shippingDelay1: 4,
      shippingDelay2 : 4,
      backlog : 0,
      record : []
    }
    var Distributor = {
      role : 'Distributor',
      stock : 12,
      order : 4,
      request : 4,
      shippingDelay1: 4,
      shippingDelay2 : 4,
      backlog : 0,
      record : []
    }
    var Wholesaler = {
      role : 'Wholesaler',
      stock : 12,
      order : 4,
      request : 4,
      shippingDelay1: 4,
      shippingDelay2 : 4,
      backlog : 0,
      record : []
    }
    var Retailer = {
      role : 'Retailer',
      stock : 12,
      order : 0,
      request : 4,
      shippingDelay1: 4,
      shippingDelay2 : 4,
      backlog : 0,
      record : []
    }
    this._playerDetail = []
    this._playerDetail['Factory'] = Factory
    this._playerDetail['Distributor'] = Distributor
    this._playerDetail['Wholesaler'] = Wholesaler
    this._playerDetail['Retailer'] = Retailer

    this._sendToPlayers('Beer Game Starts!');
    this._players.forEach((player, idx) => {
      player.emit('message','You are '+this._role[idx])
      // player.emit('message','You have '+this._playerDetail[this._role[idx]].order+' order')
    });
    this._players.forEach((player, idx) => {
      player.on('input', (input) => {
        this._onTurn(idx, input);
      });
    });

    this._startTurn();
   
  }

  _sendToPlayer(playerIndex, msg) {
    this._players[playerIndex].emit('message', msg);
  }

  _sendToPlayers(msg) {
    this._players.forEach((player) => {
      player.emit('message', msg);
    });
  }

  _startTurn(){
    this._gameStat.currentWeek+=1
    this._getRandomOrder()
    this._players.forEach((player, idx) => {
      var currentPlayer = this._playerDetail[this._role[idx]]
      player.emit('message','You have '+currentPlayer.order+' order')
      currentPlayer.stock+=currentPlayer.shippingDelay1
      currentPlayer.shippingDelay1 = currentPlayer.shippingDelay2
    });
    this._retailerCheck();
    this._wholesalerCheck();
    this._distributorCheck();
    this._factoryCheck();
    this._playerDetail['Wholesaler'].order = this._playerDetail['Retailer'].request
    this._playerDetail['Distributor'].order = this._playerDetail['Wholesaler'].request
    this._playerDetail['Factory'].order = this._playerDetail['Distributor'].request
    
  }

  _onTurn(playerIndex, input) {
    this._turns[playerIndex] = 1;
    this._sendToPlayer(playerIndex, `You have request ${input}`);
    this._playerDetail[this._role[playerIndex]].request = parseInt(input);
    this._checkTurnOver()
  }

  _endTurn(){
    this._turns = [0,0,0,0];
    this._sendToPlayers('Next turn!!!!');
    this._players.forEach((player, idx) => {
      var currentPlayer = this._playerDetail[this._role[idx]]
      console.log(currentPlayer)
    });
    this._startTurn();
  }

  _checkTurnOver(){
    var over = 1
    this._turns.forEach((turn)=>{
      if (turn==0){
        over = 0;
      }
    })
    if (over == 1){
      this._endTurn()
    }
  }
  _checkGameOver() {
    const turns = this._turns;

    if (turns[0] && turns[1]) {
      this._sendToPlayers('Game over ' + turns.join(' : '));
      this._getGameResult();
      this._turns = [null, null];
      this._sendToPlayers('Next Round!!!!');
    }
  }

  _getGameResult() {

    const p0 = this._decodeTurn(this._turns[0]);
    const p1 = this._decodeTurn(this._turns[1]);

    const distance = (p1 - p0 + 3) % 3;

    switch (distance) {
      case 0:
        this._sendToPlayers('Draw!');
        break;

      case 1:
        this._sendWinMessage(this._players[0], this._players[1]);
        break;

      case 2:
        this._sendWinMessage(this._players[1], this._players[0]);
        break;
    }
  }

  _getRandomOrder(){
    this._playerDetail['Retailer'].order = Math.floor(Math.random() * 20)+4
  }

  _retailerCheck(){
    var currentPlayer = this._playerDetail['Retailer']
    var soldToCustomer = 0;
    if (currentPlayer.stock >= currentPlayer.order+currentPlayer.backlog){
      soldToCustomer = currentPlayer.order+currentPlayer.backlog
      currentPlayer.stock = currentPlayer.stock - soldToCustomer
      currentPlayer.backlog = 0

    }
    else {
      soldToCustomer = currentPlayer.stock
      currentPlayer.backlog += currentPlayer.order - currentPlayer.stock
      currentPlayer.stock = 0
    }
  }

  _wholesalerCheck(){
    var currentPlayer = this._playerDetail['Wholesaler']
    if (currentPlayer.stock >= currentPlayer.order+currentPlayer.backlog){
      this._playerDetail['Retailer'].shippingDelay2 = currentPlayer.order+currentPlayer.backlog
      currentPlayer.stock = currentPlayer.stock-this._playerDetail['Retailer'].shippingDelay2
      currentPlayer.backlog = 0
    }
    else {
      this._playerDetail['Retailer'].shippingDelay2 = currentPlayer.stock
      currentPlayer.backlog += currentPlayer.order - currentPlayer.stock
      currentPlayer.stock = 0
    }
  }

  _distributorCheck(){
    var currentPlayer = this._playerDetail['Distributor']
    if (currentPlayer.stock >= currentPlayer.order+currentPlayer.backlog){
      this._playerDetail['Wholesaler'].shippingDelay2 = currentPlayer.order+currentPlayer.backlog
      currentPlayer.stock =currentPlayer.stock- this._playerDetail['Wholesaler'].shippingDelay2
      currentPlayer.backlog = 0
    }
    else {
      this._playerDetail['Wholesaler'].shippingDelay2 = currentPlayer.stock
      currentPlayer.backlog += currentPlayer.order - currentPlayer.stock
      currentPlayer.stock = 0
    }
  }

  _factoryCheck(){
    var currentPlayer = this._playerDetail['Factory']
    if (currentPlayer.stock >= currentPlayer.order+currentPlayer.backlog){
      this._playerDetail['Distributor'].shippingDelay2 = currentPlayer.order+currentPlayer.backlog
      currentPlayer.stock = currentPlayer.stock - this._playerDetail['Distributor'].shippingDelay2
      currentPlayer.backlog = 0
    }
    else {
      this._playerDetail['Distributor'].shippingDelay2 = currentPlayer.stock
      currentPlayer.backlog += currentPlayer.order - currentPlayer.stock
      currentPlayer.stock = 0
    }
    currentPlayer.shippingDelay2 = currentPlayer.request
  }

  _sendWinMessage(winner, loser) {
    winner.emit('message', 'You won!');
    loser.emit('message', 'You lost.');
  }

  _decodeTurn(turn) {
    switch (turn) {
      case 'rock':
        return 0;
      case 'scissors':
        return 1;
      case 'paper':
        return 2;
      default:
        throw new Error(`Could not decode turn ${turn}`);
    }
  }


}

module.exports = RpsGame;
