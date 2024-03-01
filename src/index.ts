import { Player, Resources, Investment, Mobilize, BuildShips } from './types';

export const ONE_DAY = 86400000 // 24 hours in milliseconds
const INCOME_UPDATE_INTERVAL = ONE_DAY

function updatePlayerState(player: Player) {
  // Update player's storage based on income
  const now = new Date()
  if (now.getTime() - player.state.info.lastIncomeUpdate.getTime() >= INCOME_UPDATE_INTERVAL) {
    updateStorage(player, player.state.income)
    updateStorage(player, player.state.expenses)
    player.state.info.lastIncomeUpdate = now
  }

  // Process pending transactions
  for (let transaction of player.transactions.pendingTransactions) {
    switch (transaction.transactionType) {
      case 'investment':
        transaction = transaction as Investment
        player.state.cities[transaction.city].industries[transaction.industry]++
        player.state.cities[transaction.city].isWalled = true
        updateStorage(player, transaction.resourceChange)
        break
      case 'mobilize':
        transaction = transaction as Mobilize
        if (transaction.mobilizeFrom === 'reserve') {
          player.state.military.army.reserve -= transaction.numberOfTroops
          player.state.military.army.active += transaction.numberOfTroops
        } else if (transaction.mobilizeFrom === 'population') {
          player.state.military.army.active += transaction.numberOfTroops
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