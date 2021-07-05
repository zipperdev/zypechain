import * as CryptoJS from "crypto-js";

class Block {
    public index: number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;

    static calculateBlockHash = (
        index: number, 
        previousHash: string, 
        timestamp: number,
        data: string
    ): string => CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
    static validateStructure = (block: Block): boolean => 
        typeof block.index === "number" && 
        typeof block.hash === "string" && 
        typeof block.previousHash === "string" && 
        typeof block.timestamp === "number" && 
        typeof block.data === "string";

    constructor(
        index: number, 
        hash: string, 
        previousHash: string, 
        data: string, 
        timestamp: number
    ) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    };
};

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

const genesisBlock: Block = new Block(0, "FIRSTBLOCKHASH", "", "First Block", getNewTimeStamp());

let blockchain: [Block] = [genesisBlock];

const getBlockchain = (): [Block] => blockchain;
const getLatestBlock = (): Block => blockchain[blockchain.length - 1];
const createNewBlock = (data: string): Block => {
    const previousBlock: Block = getLatestBlock();
    const newIndex: number = previousBlock.index + 1;
    const newTimestamp: number = getNewTimeStamp();
    const newHash: string = Block.calculateBlockHash(
        newIndex, 
        previousBlock.hash, 
        newTimestamp, 
        data
    );

    const newBlock: Block = new Block(
        newIndex, 
        newHash, 
        previousBlock.hash, 
        data, 
        newTimestamp
    );
    addBlock(newBlock);
    return newBlock;
};
const getHashForBlock = (block: Block): string => Block.calculateBlockHash(
    block.index, 
    block.previousHash, 
    block.timestamp, 
    block.data
);
const isBlockValid = (
    candidateBlock: Block, 
    previousBlock: Block
): boolean => {
    if (!Block.validateStructure(candidateBlock)) {
        return false;
    } else if (previousBlock.index + 1 !== candidateBlock.index) {
        return false;
    } else if (previousBlock.hash !== candidateBlock.previousHash) {
        return false;
    } else if (getHashForBlock(candidateBlock) !== candidateBlock.hash) {
        return false;
    } else {
        return true;
    };
};
const addBlock = (candidateBlock: Block): void => {
    if (isBlockValid(candidateBlock, getLatestBlock())) {
        blockchain.push(candidateBlock);
    };
};

// Create New Block
createNewBlock("Second Block");
createNewBlock("Third Block");
createNewBlock("Forth Block");

// See Blockchain
console.log(getBlockchain());

export {};