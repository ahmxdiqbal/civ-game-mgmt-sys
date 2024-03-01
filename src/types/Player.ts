import { Resources, City } from './State'
import { Transaction } from './Transactions'

type CityList = {
  [key: string]: City
}

interface Military {
  army: {
    active: number
    reserve: number
  }
  navy: {
    warships: number
    battleships: number
  }
}

interface PlayerInfo {
  name: string
  nation: string
  lastIncomeUpdate: Date
}

export interface Player {
  state: {
    info: PlayerInfo
    storage: Resources
    income: Resources
    expenses: Resources
    cities: CityList
    military: Military
  }
  transactions: {
    pendingTransactions: Transaction[]
    allTransactions: Transaction[]
  }
}