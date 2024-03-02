import { Player, Resources, Investment, Mobilize, BuildShips } from './types';

export const START_OF_GAME = new Date('2024-02-23T00:00:00.000Z')
export const ONE_DAY = 86400000 // 24 hours in milliseconds
const INCOME_UPDATE_INTERVAL = ONE_DAY

function updatePlayerState(player: Player) {
  // Update player's storage based on income
  const now = new Date()
  if (now.getTime() - player.state.info.lastIncomeUpdate.getTime() >= INCOME_UPDATE_INTERVAL) {
    applyDailyChanges(player)
    player.state.info.lastIncomeUpdate = now
  }

  // Process pending transactions
  for (let transaction of player.transactions.pendingTransactions) {
    switch (transaction.transactionType) {
      case 'investment':
        transaction = transaction as Investment
        player.state.cities[transaction.city].industries[transaction.industry]++
        player.state.assests[transaction.industry]++
        if (player.state.cities[transaction.city].isWalled === false) {
          player.state.cities[transaction.city].isWalled = true
          player.state.assests.majorCities++
        }
        updateStorage(player, transaction.resourceChange)
        break
      case 'mobilize':
        transaction = transaction as Mobilize
        if (transaction.mobilizeFrom === 'reserve') {
          player.state.military.army.reserve -= transaction.numberOfTroops
          player.state.military.army.active += transaction.numberOfTroops
        } else if (transaction.mobilizeFrom === 'population') {
          player.state.military.army.active += transaction.numberOfTroops
          player.state.assests.population -= transaction.numberOfTroops
        }
        updateStorage(player, transaction.resourceChange)
        break
      case 'build-ship':
        transaction = transaction as BuildShips
        player.state.military.navy.warships += transaction.warships
        player.state.military.navy.battleships += transaction.battleships
        updateStorage(player, transaction.resourceChange)
        break
      default:
        console.error('Invalid transaction type')
        break
    }
  }
}

function updateStorage(player: Player, resourceChange: Resources) {
  player.state.storage.gold += resourceChange.gold
  player.state.storage.iron += resourceChange.iron
  player.state.storage.lumber += resourceChange.lumber
  player.state.storage.grain += resourceChange.grain
  player.state.storage.livestock += resourceChange.livestock
}

export function applyDailyChanges(player: Player) {
  updateStorage(player, player.state.income)
  updateStorage(player, player.state.expenses)
}

/*

for every player:
  function getTransactions:
    get transactions from google sheet
      parse transactions from sheet and create transactions 

    insert income and expense into transaction sorted by timeSubmitted

  function processTransactions:
    apply each transaction
      we need to mark transacton as success or fail
        if success, remove from pendingTransactions
        if fail 


Mustafa Ahmad TODOs:

add population to city object

create insertSorted function
create dummy transactions list
use insertSorted to insert income and expense into transactions

switch from using switch statement to using if else ladder to process transactions
process transactions in order of timeSubmitted

support maneuver transaction;
  move troops from one city you own to another city you own, major or minor

*/
