import { Resources, City, Industries, PlayerInfo, Military } from './State'
import { Transaction } from './Transactions'

type CityList = {
  [key: string]: City
}

export interface Player {
  state: {
    info: PlayerInfo
    assests: {
      population: number
      majorCities: number
    } & Industries
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