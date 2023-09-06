const europa = require('./src/oracle_razor_europa');
const calypso = require('./src/oracle_razor_calypso');
const nebula = require('./src/oracle_razor_nebula');

async function get_all(){

    await europa.run();

    await calypso.run();

    await nebula.run();

}

async function run(){

    await get_all();
}

run();