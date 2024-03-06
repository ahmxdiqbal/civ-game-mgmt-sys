[x] add population to city object

[x] create insertSorted  - prefer binary search
[] create dummy transactions list
[x] use insertSorted to insert income and expense into transactions

[x] switch from using switch statement to using if else ladder to process transactions
[x] process transactions in order of timeSubmitted

[] support maneuver transaction: move troops from one city you own to another city you own, major or minor

[] support import and export transactions:
  for a trade to be successful, 
    both players must have the resources they are trading
    both players must submit a compatibat and reciprocative transaction

  ex trade. moskov trade with aurelian 100 gold for 10 iron

  moskov request will contain: partner: aurelian, import: 10 iron, export: 100 gold
  aurelian request will contain: partner: moskov, import: 100 gold, export: 10 iron
