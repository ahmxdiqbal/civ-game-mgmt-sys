
export interface Resources {
  gold: number
  iron: number
  lumber: number
  grain: number
  livestock: number
}

interface Industries {
  militaryBases: number
  ironForges: number
  lumberMills: number
  grainFarms: number
  livestockRanches: number
}

export interface City {
  name: string
  isWalled: boolean
  troopsGarrisoned: number
  industries: Industries
}