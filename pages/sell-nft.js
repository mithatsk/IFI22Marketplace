/* pages/sell-nft.js */
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import marketplaceController from '../controllers/MarketplaceController'

export default function SellNFT() {
  const [formInput, updateFormInput] = useState({ price: '', image: '' })
  const router = useRouter()
  const { id, tokenURI } = router.query
  const { image } = formInput

  useEffect(() => {
    fetchNFT()
  }, [id])

  async function fetchNFT() {
    if (!tokenURI) return
    const meta = await axios.get(tokenURI)
    updateFormInput(state => ({ ...state, image: meta.data.image }))
  }

  async function sellNFT() {
    await marketplaceController.sellNFT(id, formInput.price)
    router.push('/')
  }

  return (
    <div className="flex justify-center">
      <div className="flex flex-col pb-12">
      <div className="flex justify-center items-center">
        {
          image && (
            <img className="rounded mt-4" width="500" src={image} />
          )
        }
        </div>
        <input
          placeholder="NFT Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <button onClick={sellNFT} className="font-bold mt-4 bg-indigo-900 text-white rounded p-4 shadow-lg">
          List NFT
        </button>
      </div>
    </div>
  )
}