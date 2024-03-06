
export interface Resources {
  gold: number
  iron: number
  lumber: number
  grain: number
  livestock: number
}

export interface Industries {
  militaryBases: number
  ironForges: number
  lumberMills: number
  grainFarms: number
  livestockRanches: number
}

export interface City {
  name: string
  population: number
  isWalled: boolean
  troopsGarrisoned: number
  industries: Industries
}

export interface Military {
  army: {
    active: number
    reserve: number
  }
  navy: {
    warships: number
    battleships: number
  }
}

export interface PlayerInfo {
  name: string
  nation: string
  lastIncomeUpdate: Date
}