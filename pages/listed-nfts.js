/* pages/listed-nfts.js */
import { useEffect, useState } from 'react'
import marketplaceController from '../controllers/MarketplaceController'

export default function ListedNFTs() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    const items = await marketplaceController.fetchListedNFTs()
    setNfts(items)
    setLoadingState('loaded') 
  }

  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">There is no NFT listed</h1>)
  return (
    <div>
      <div className="p-4">
        <h2 className="text-2xl py-2">Items Listed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="flex items-center justify-center">
                <div className="rounded-lg">
                  <img src={nft.image} className="rounded-t-lg" />
                  <div className="bg-indigo-900 rounded-b-lg p-4">
                    <p className="text-white font-semibold">
                      {nft.name}
                    </p>
                    <p className="text-2xl font-bold text-white">
                      Price - {nft.price} Eth
                    </p>
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