const SHA256 = require('crypto-js/sha256');

class Block {
  constructor (index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)) + '';
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, '01/01/1970', 'Genesis Block', '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) return 0;
      if (currentBlock.previousHash !== previousBlock.hash) return 0
    }

    return 1;
  }
}

const yofriCoin = new Blockchain();
yofriCoin.addBlock(new Block(1, '25/08/2017', { amount: 2 }));
yofriCoin.addBlock(new Block(2, '10/10/2017', { amount: 5 }));

console.log(`Is blockchain valid? ${yofriCoin.isChainValid()}`);

yofriCoin.chain[1].data = { amount: '100' };
yofriCoin.chain[1].hash = yofriCoin.chain[1].calculateHash();

console.log(`Is blockchain valid? ${yofriCoin.isChainValid()}`);

console.log(JSON.stringify(yofriCoin, null, 2));