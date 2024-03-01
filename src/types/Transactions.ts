import { Resources } from './State'

export type Transaction = Investment | Mobilize | BuildShips
export type TransactionType = 'investment' | 'trade' | 'mobilize' | 'build-ship'
export type Industry = 'militaryBases' | 'ironForges' | 'lumberMills' | 'grainFarms' | 'livestockRanches'
export type MobilizationSource = 'reserve' | 'population'
export type ShipType = 'warship' | 'battle-ship'

interface BaseTransaction {
  transactionType: TransactionType
  timeSubmitted: Date
  timeUntilCompletion: number
  resourceChange: Resources
}

export interface Investment extends BaseTransaction {
  city: string
  industry: Industry
}

export interface Mobilize extends BaseTransaction {
  mobilizeFrom: 'reserve' | 'population'
  numberOfTroops: number
}

export interface BuildShips extends BaseTransaction {
  warships: number
  battleships: number
}
