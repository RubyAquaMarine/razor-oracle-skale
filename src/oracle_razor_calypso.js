const ethers = require('ethers');
const config = require('../setConfig.json');
const credentials = require('../keys.json');
const chalk = require('chalk');
//--------------------------------------ADJUST-----------------------------------||
const providerOrigin = new ethers.providers.JsonRpcProvider(config.rpc.schain_Calypso); // SKALE CHAIN, works with schain_Nebula, schain_Calypso, staging_europa
const walletOrigin = new ethers.Wallet(credentials.account.privateKey);
const accountOrigin = walletOrigin.connect(providerOrigin);

//- https://docs.razor.network/docs/consume-data-feeds/transparent-forwarder/
//- https://razorscan.io/governance/datafeeds
// const ORACLE = '0xbF5c5AD799b2245BA36562BebfcbAbc5D508Eb84';// testnet 

const ORACLE = '0xEb9324f0d17e4dEa7371f6dddf361D9bB453BEb9';// mainnet

const ASSET = 'ETHUSD';

async function RazorOracle() {
    const abi = [{
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "id",
                "type": "bytes32"
            },

        ],
        "name": "getResult",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "internalType": "uint8",
                "name": "power",
                "type": "uint8"
            },
        ],
        "stateMutability": "pure",
        "type": "function"
    }]

    const oracle = new ethers.Contract(ORACLE, abi, accountOrigin);
    const id = ethers.utils.solidityKeccak256(['string'], [ASSET]);

    const test = await oracle.getResult(id).then(res => {
        return res;
    }).catch(err => {
        console.log("error:", err)
        return err;
    });

    if (typeof test === 'object') {
        let count = 0;
        test.forEach(element => {
            console.log(`rawData [${count}] ${element.toString()}`);
            count = count + 1;
        });
        const real_price = ethers.utils.formatUnits(test[0], test[1])
        if (typeof real_price === 'string') {
            return real_price;
        }
    }

    return '0';
}

async function run() {
    const razor_price = await RazorOracle();
    console.log(chalk.blue(`${ASSET}`), chalk.yellow(razor_price), chalk.green(providerOrigin.connection.url));
}


module.exports.run = run;