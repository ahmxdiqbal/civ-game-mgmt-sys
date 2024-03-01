import fs from 'fs'
import { applyDailyChanges } from '../src/index'

function test1() {
  const playerObject = fs.readFileSync('./data/moskov_dominion.json', 'utf-8')
  const moskov = JSON.parse(playerObject)
  console.log(moskov.state.storage)
  console.log('applying daily changes...')
  applyDailyChanges(moskov)
  console.log(moskov.state.storage)
}

test1()
