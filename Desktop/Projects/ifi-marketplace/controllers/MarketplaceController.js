import { ethers } from 'ethers'
import axios from 'axios'
import Web3Modal from 'web3modal'

import {
    marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

// Unsigned contract, we will use this for transactions that does not require authorization such as fetching all NFTs.
const unsignedProvider = new ethers.providers.JsonRpcProvider()
const unsignedContract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, unsignedProvider)

// Signed contract, we prompt user to connect a wallet. We will use this contract for any action that updates, creates etc.
async function getSignedContract() {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const signedProvider = new ethers.providers.Web3Provider(connection)
    const signer = signedProvider.getSigner()
    const signedContract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    return signedContract
}

async function fetchAllNFTs() {
    const data = await unsignedContract.fetchMarketItems()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await unsignedContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))

    return items
}

async function fetchPersonalNFTs() {
    const signedContract = await getSignedContract()
    const data = await signedContract.fetchPersonalNFTs()

    const items = await Promise.all(data.map(async i => {
      const tokenURI = await signedContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenURI)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        tokenURI
      }
      return item
    }))

    return items
}

async function fetchListedNFTs() {
    const signedContract = await getSignedContract()
    const data = await signedContract.fetchItemsListed()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await signedContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
      }
      return item
    }))

    return items
}

async function sellNFT(id, price) {
    if (!price) return
    const priceFormatted = ethers.utils.parseUnits(price, 'ether')
    const signedContract = await getSignedContract()

    let listingPrice = await signedContract.getListingPrice()

    listingPrice = listingPrice.toString()
    let transaction = await signedContract.resellToken(id, priceFormatted, { value: listingPrice })
    await transaction.wait()
}

async function buyNFT(nft) {
    const signedContract = await getSignedContract()
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
    const transaction = await signedContract.createMarketSale(nft.tokenId, {
      value: price
    })
    await transaction.wait()
}

async function createNFT(url, price) {
    const signedContract = await getSignedContract()
    const etherPrice = ethers.utils.parseUnits(price, 'ether')
    let listingPrice = await signedContract.getListingPrice()
    listingPrice = listingPrice.toString()
    let transaction = await signedContract.createToken(url, etherPrice, { value: listingPrice })
    await transaction.wait()
}

module.exports = {
    fetchAllNFTs,
    fetchPersonalNFTs,
    fetchListedNFTs,
    sellNFT,
    buyNFT,
    createNFT
}