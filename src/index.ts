import * as Types from './types';
import { insertSorted } from './Utils';
import fs from 'fs';
import path from 'path';

// Constants

export const START_OF_GAME = new Date('2024-02-23T00:00:00.000Z')
export const ONE_DAY = 86400000 // 24 hours in milliseconds
const INCOME_UPDATE_INTERVAL = ONE_DAY

// Variables

const players: Map<string, Types.Player> = new Map()

// Functions

function updateStorage(player: Types.Player, resourceChange: Types.Resources) {
  player.state.storage.gold += resourceChange.gold
  player.state.storage.iron += resourceChange.iron
  player.state.storage.lumber += resourceChange.lumber
  player.state.storage.grain += resourceChange.grain
  player.state.storage.livestock += resourceChange.livestock
}

function loadPlayerData() {
  const dataDirectory = path.join(__dirname, '..', 'data');

  try {
    const files = fs.readdirSync(dataDirectory);

    for (const file of files) {
      if (path.extname(file) === '.json') { // Ensure the file is a JSON file
        const filePath = path.join(dataDirectory, file);

        const playerFile = fs.readFileSync(filePath, 'utf8');

        try {
          const playerData = JSON.parse(playerFile);

          players.set(playerData.state.info.nation, playerData);
        } catch (err) {
          console.error(`Error parsing JSON from file: ${file}`, err);
        }
      }
    }
    console.log('Loaded Player Data');
  } catch (err) {
    console.error("Could not list the directory or read files", err);
  }

  console.log('end of loadPlayerData');
}

function parseAndInsertTransactionsFromSheet(player: Types.Player): void {

}

function insertIncomeAndExpenseTransactions(player: Types.Player): void {
  const now = new Date()
  while (now.getTime() > player.state.info.lastIncomeUpdate.getTime() + INCOME_UPDATE_INTERVAL) {
    player.state.info.lastIncomeUpdate = new Date(player.state.info.lastIncomeUpdate.getTime() + INCOME_UPDATE_INTERVAL)

    const income = {
      transactionType: 'income',
      timeSubmitted: player.state.info.lastIncomeUpdate,
      timeUntilCompletion: 0,
      resourceChange: null
    } as unknown as Types.BaseTransaction

    const expenses = {
      transactionType: 'expenses',
      timeSubmitted: player.state.info.lastIncomeUpdate,
      timeUntilCompletion: 0,
      resourceChange: null
    } as unknown as Types.BaseTransaction

    insertSorted(player.transactions.pendingTransactions, income)
    insertSorted(player.transactions.pendingTransactions, expenses)
    insertSorted(player.transactions.allTransactions, income)
    insertSorted(player.transactions.allTransactions, expenses)
  }
}

function pushTransaction(player: Types.Player, transaction: Types.Transaction): void {
  insertSorted(player.transactions.pendingTransactions, transaction)
  insertSorted(player.transactions.allTransactions, transaction)
}

function getTransactions(player: Types.Player): void {
  //parseAndInsertTransactionsFromSheet(player)

  //insertIncomeAndExpenseTransactions(player)

  const dummyTransactions: Types.Transaction[] = [
    {
      transactionType: 'investment',
      timeSubmitted: new Date('2024-02-23T01:00:00.000Z'),
      timeUntilCompletion: 0,
      resourceChange: {
        gold: -100,
        iron: -100,
        lumber: -100,
        grain: 0,
        livestock: 0
      },
      city: 'Bursa',
      industry: 'militaryBases'
    },
    {
      transactionType: 'mobilize',
      timeSubmitted: new Date('2024-02-23T02:00:00.000Z'),
      timeUntilCompletion: 0,
      resourceChange: {
        gold: -10,
        iron: -1,
        lumber: 0,
        grain: 0,
        livestock: 0
      },
      mobilizeFrom: 'reserve',
      numberOfTroops: 1000
    },
  ]

  for (const transaction of dummyTransactions) {
    pushTransaction(player, transaction)
  }
}

function processTransactions(player: Types.Player): void {
  for (let transaction of player.transactions.pendingTransactions) {
    if (transaction.transactionType === 'income') {
      // Apply income
      updateStorage(player, player.state.income)
      player.transactions.pendingTransactions.shift()
    } else if (transaction.transactionType === 'expenses') {
      // Apply expenses
      updateStorage(player, player.state.expenses)
      player.transactions.pendingTransactions.shift()
    } else if (transaction.transactionType === 'investment') {
      const investmentTransaction = transaction as Types.Investment
      player.state.cities[investmentTransaction.city].industries[investmentTransaction.industry]++
      player.state.assests[investmentTransaction.industry]++
      if (player.state.cities[investmentTransaction.city].isWalled === false) {
        player.state.cities[investmentTransaction.city].isWalled = true
        player.state.assests.majorCities++
      }
      updateStorage(player, investmentTransaction.resourceChange)
      player.transactions.pendingTransactions.shift()
    } else if (transaction.transactionType === 'mobilize') {
      const mobilizeTransaction = transaction as Types.Mobilize
      if (mobilizeTransaction.mobilizeFrom === 'reserve') {
        player.state.military.army.reserve -= mobilizeTransaction.numberOfTroops
        player.state.military.army.active += mobilizeTransaction.numberOfTroops
      } else if (mobilizeTransaction.mobilizeFrom === 'population') {
        player.state.military.army.active += mobilizeTransaction.numberOfTroops
        player.state.assests.population -= mobilizeTransaction.numberOfTroops
      }
      updateStorage(player, mobilizeTransaction.resourceChange)
      player.transactions.pendingTransactions.shift()
    } else if (transaction.transactionType === 'build-ship') {
      const buildShipTransaction = transaction as Types.BuildShips
      player.state.military.navy.warships += buildShipTransaction.warships
      player.state.military.navy.battleships += buildShipTransaction.battleships
      updateStorage(player, buildShipTransaction.resourceChange)
      player.transactions.pendingTransactions.shift()
    } else if (transaction.transactionType === 'maneuver') {
      const maneuverTransaction = transaction as Types.Maneuver
      player.state.cities[maneuverTransaction.from].troopsGarrisoned -= maneuverTransaction.troops
      player.state.cities[maneuverTransaction.to].troopsGarrisoned += maneuverTransaction.troops
      player.transactions.pendingTransactions.shift()
    }
  }
}

// Entry point

function start(): void {
  loadPlayerData()

  for (const player of players.values()) {
    console.log(player.state.info.nation)

    getTransactions(player)

    //processTransactions(player)
    
  }
}

start()

/*

on startup:
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

*/
