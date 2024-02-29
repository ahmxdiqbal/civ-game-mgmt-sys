import { Player, Transaction, Industry, MobilizationSource, ShipType } from './types'
import { ONE_DAY } from './index'

function createInvestmentTransaction(player: Player, city: string, industry: Industry) {
  const resourceChange = {
    gold: -500,
    iron: 0,
    lumber: 0,
    grain: 0,
    livestock: 0
  }

  const investment: Transaction = {
    transactionType: 'investment',
    timeSubmitted: new Date(),
    timeUntilCompletion: ONE_DAY,
    city,
    industry,
    resourceChange
  }

  addTransaction(player, investment)
}

function createMobilizationTransaction(player: Player, from: MobilizationSource, amount: number) {
  let resourceChange = {
    gold: 0,
    iron: -1,
    lumber: 0,
    grain: 0,
    livestock: 0
  }

  // Adjust resource change based on mobilization source
  if (from === 'reserve') resourceChange.gold = -10
  else if (from === 'population') resourceChange.gold = -500
  else console.error('Invalid mobilization source')

  const investment: Transaction = {
    transactionType: 'mobilize',
    timeSubmitted: new Date(),
    timeUntilCompletion: ONE_DAY,
    resourceChange,
    mobilizeFrom: from,
    numberOfTroops: amount
  }

  addTransaction(player, investment)
}

function createBuildShipsTransaction(player: Player, warships: number, battleships: number) {
  const resourceChange = {
    gold: 0,
    iron: 0,
    lumber: 0,
    grain: 0,
    livestock: 0
  }

  // Adjust resource change based on ship types
  resourceChange.iron -= warships * 10
  resourceChange.lumber -= warships * 20
  resourceChange.iron -= battleships * 5
  resourceChange.lumber -= battleships * 10

  const investment: Transaction = {
    transactionType: 'build-ship',
    timeSubmitted: new Date(),
    timeUntilCompletion: ONE_DAY,
    resourceChange,
    warships,
    battleships
  }

  addTransaction(player, investment)
}

function addTransaction(player: Player, transaction: Transaction) {
  player.transactions.pendingTransactions.push(transaction)
  player.transactions.allTransactions.push(transaction)
}
