/* pages/owned-nfts.js */
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import marketplaceController from '../controllers/MarketplaceController'

export default function MyAssets() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const router = useRouter()

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    const items = await marketplaceController.fetchOwnedNFTs()
    setNfts(items)
    setLoadingState('loaded') 
  }

  function listNFT(nft) {
    console.log('nft:', nft)
    router.push(`/sell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`)
  }

  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No NFTs owned</h1>)
  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="flex items-center justify-center">
                <div className="rounded-lg">
                  <img src={nft.image} className="rounded-t-lg" />
                  <div className="bg-indigo-900 text-center rounded-b-lg p-4">
                    <p className="text-white text-xl font-bold pt-3">
                      {nft.name}
                    </p>
                    <p className="text-white text-sm font-light pt-3">
                    Price - {nft.price} Eth
                    </p>
                    <button className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-12 rounded" onClick={() => listNFT(nft)}>
                    List
                    </button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}