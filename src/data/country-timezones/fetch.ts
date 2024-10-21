import { writeFile } from 'node:fs/promises'
import { execSync } from 'node:child_process'

const fetchData = async () => {
  const response = await fetch('https://raw.githubusercontent.com/eggert/tz/main/zone.tab')
  const raw = await response.text()
  const data = raw
    .split('\n')
    .filter(i => i.length > 0 && !i.startsWith('#'))
    .map((i) => {
      const parts = i.split('\t')
      return {
        country: parts[0],
        identifier: parts[2],
      }
    })
    // eslint-disable-next-line unicorn/no-array-reduce
    .reduce((acc, curr) => {
      if (!acc[curr.country]) acc[curr.country] = []
      acc[curr.country].push(curr.identifier)
      return acc
    }, {} as {
      [country: string]: string[]
    })

  await writeFile('./src/data/country-timezones/index.ts', `export interface CountryTimezonesData {
  [country: string]: string[]
}

export const countryTimezones: CountryTimezonesData = ${JSON.stringify(data, null, 2)}
`)
  execSync('pnpm eslint --fix ./src/data/country-timezones/index.ts', { stdio: 'inherit' })
}
fetchData()
