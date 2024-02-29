
export interface Resources {
  gold: number
  iron: number
  lumber: number
  grain: number
  livestock: number
}

interface Industries {
  militaryBases: number
  ironForge: number
  lumberMill: number
  grainFarm: number
  livestockRanch: number
}

export interface City {
  name: string
  isWalled: boolean
  troopsGarrisoned: number
  industries: Industries
}