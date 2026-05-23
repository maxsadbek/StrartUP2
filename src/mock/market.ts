export const liveFuelPrices = [
  { type: 'ai92', label: 'AI-92', price: 10120, change: -0.8, trend: 'down' as const },
  { type: 'ai95', label: 'AI-95', price: 11320, change: 0.2, trend: 'up' as const },
  { type: 'ai98', label: 'AI-98', price: 12700, change: 0, trend: 'stable' as const },
  { type: 'diesel', label: 'Diesel', price: 9850, change: -1.2, trend: 'down' as const },
]

export const fuelTrends = [
  { day: 'Mon', ai92: 10200, ai95: 11400 },
  { day: 'Tue', ai92: 10180, ai95: 11380 },
  { day: 'Wed', ai92: 10150, ai95: 11350 },
  { day: 'Thu', ai92: 10140, ai95: 11340 },
  { day: 'Fri', ai92: 10130, ai95: 11330 },
  { day: 'Sat', ai92: 10125, ai95: 11325 },
  { day: 'Sun', ai92: 10120, ai95: 11320 },
]

export const testimonials = [
  { name: 'Aziz Karimov', role: 'Taxi Driver', text: 'FuelGo saves me 45 minutes daily. The taxi mode and cheapest fuel alerts are game changers.', avatar: 'AK' },
  { name: 'Dilnoza R.', role: 'Daily Commuter', text: 'Finally an app that feels premium. Live prices and queue times are always accurate.', avatar: 'DR' },
  { name: 'Timur S.', role: 'Fleet Manager', text: 'We rolled out FuelGo to 120 drivers. Delivery and analytics paid for themselves in week one.', avatar: 'TS' },
]
