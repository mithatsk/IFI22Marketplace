/* pages/index.js */
import { useCallback, useEffect, useState } from 'react'
import marketplaceController from '../controllers/MarketplaceController'

export default function Home() {
  const [nfts, setNFTs] = useState([])
  const [filteredNFTs, setFilteredNFTs] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  const onChange = useCallback((event) => {
    const query = event.target.value
    const items = items = filterByValue(nfts, query)
    console.log(items)
    setFilteredNFTs(items)
  }, [])

  function filterByValue(array, string) {
    return array.filter(o =>
        Object.keys(o).some(k => o['name'].toString().toLowerCase().includes(string.toLowerCase())));
  }

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    const items = await marketplaceController.fetchAllNFTs()
    setNFTs(items)
    setFilteredNFTs(items)
    setLoadingState('loaded') 
  }

  async function buyNft(nft) {
    await marketplaceController.buyNFT(nft)
    loadNFTs()
  }

  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="flex justify-center pt-10">
          <div className="mb-3 xl:w-96">
            <input type="search" className=" form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0
                focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleSearch" placeholder="Search"
                onChange={onChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            filteredNFTs.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} />
                <div className="p-4">
                  <p style={{ height: '48px' }} className="text-2xl font-semibold">{nft.name}</p>
                  <div style={{ height: '60px', overflow: 'hidden' }}>
                    <p className="text-gray-400">{nft.type}</p>
                    <p className="text-gray-400">{nft.address}</p>
                  </div>
                </div>
                <div className="p-4 bg-indigo-900">
                  <p className="text-3xl font-bold text-white">{nft.price} ETH</p>
                  <button className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}