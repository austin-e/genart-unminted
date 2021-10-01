import { GenArtInfo, fetchMemberships } from './api/memberships'
import pMap from 'p-map'
import { format as ts } from 'timeago.js'
import { chunk, flatten, orderBy } from 'lodash'

export async function getStaticProps() {
  const data = await fetchMemberships()
  
  return {
    props: {
      memberships: data.memberships,
      lastUpdate: data.lastUpdate,
    },
    revalidate: 300,
  }
}

interface Props {
  memberships: GenArtInfo[]
  mints_available: any[]
  lastUpdate: string
}

const Memberships = ({ membership }: { membership: GenArtInfo }) =>
{
  return (
    <a>
    <a href={membership.url} target="_blank">
      <div className="m-auto pb-4 mb-8 flex flex-col justify-center items-center gap-2 p-4 md:m-4 border border-white transform hover:scale-105 transition-all bg-black w-full md:w-96">
        <div className="text-center">
          <p className="text-lg">#{membership.id}</p>
          <p>{membership.price} ETH</p>
        </div>
      </div>
    </a>
    <a href={membership.meta_url} target="_blank">
    <div className="m-auto pb-4 mb-8 flex flex-col justify-center items-center gap-2 p-4 md:m-4 border border-gold transform hover:scale-105 transition-all bg-gold w-full md:w-96">
      <div className="text-center">
      <p className="text-lg">DYOR. Please click and confirm you see "available":"1" three times !!</p>
      </div>
    </div>
  </a>
  </a>
  )
}

const IndexPage = ({ memberships, lastUpdate }: Props) => {
  return (
    <div className="py-3 md:pb-0 font-mono flex flex-col justify-center items-center gap-4 pt-10 md:w-screen">
      <h1 className="text-lg md:text-3xl">Unminted Memberships</h1>
      <div className="text-center max-w-screen-md md:leading-loose">
        <p className="md:text-xl">
          There are {memberships.length} bags for sale with Unminted Memberships. The floor
          price is {memberships[0].price} ETH.
        </p>
        <p className="md:text-lg pt-2">
          Site by{' '}
          <a
            target="_blank"
            href="https://twitter.com/polk_jk"
            className="underline"
          >
            polk_jk
          </a>
          . Join the{' '}
          <a
            target="_blank"
            className="underline"
              href="https://discord.gg/C9SeZAz8"
          >
            Discord
          </a>
          .
        </p>
        <p className="text-sm mv-4">Last updated {ts(lastUpdate)}</p>
        <p className="text-sm mv-4">Based off work by worm_emoji for https://robes.market/</p>
      </div>
      <div className="grid md:grid-cols-3 pt-4">
        {memberships.map((membership) => {
          return <Memberships membership={membership} key={membership.id} />
        })}
      </div>
    </div>
  )
}

export default IndexPage