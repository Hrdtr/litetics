import { execSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const fetchData = async () => {
  const response = await fetch(
    'https://s3-eu-west-1.amazonaws.com/snowplow-hosted-assets/third-party/referer-parser/referers-latest.json',
  );
  const data = await response.json();

  await writeFile(
    './src/data/referrers/index.ts',
    `export interface ReferrersData {
  [medium: string]: {
    [name: string]: {
      domains: string[]
      parameters?: string[]
    };
  };
}

export const referrers: ReferrersData = ${JSON.stringify(data, null, 2)}
`,
  );

  execSync('pnpm oxlint --fix ./src/data/referrers/index.ts', { stdio: 'inherit' });
};
fetchData();
