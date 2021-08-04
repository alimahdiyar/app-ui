const urls = [{
  name: 'Mint',
  link: '/dei/mint'
},
{
  name: 'Redeem',
  link: '/dei/redeem'
},
{
  name: 'Buyback & Recollateralize',
  link: '/dei/buyback-recollat'
},
]

const costs = [{
  name: 'COLLATERAL RATIO',
  value: '84.00%'
},
{
  name: 'REDEMPTION FEE',
  value: '0.55%'
},
{
  name: 'POOL BALANCE',
  value: '20.24 USDC'
},
]


const costs2 = [{
  name: 'EXCHANGE RATES',
  isTwoWay: true,
  title1: 'USDC: ',
  value1: '$1.000',
  title2: 'DEI: ',
  value2: '$874.34'
},
{
  name: 'SWAP FEE',
  isTwoWay: false,
  value1: '0.6%',
},
{
  name: 'POOL 🌊',
  isTwoWay: false,
  value1: '....',
},
]


export {
  urls,
  costs,
  costs2,
}