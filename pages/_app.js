/* pages/_app.js */
import '../styles/globals.css'
import Link from 'next/link'

const MyApp = ({ Component, pageProps }) => {
  return (
    <div>
      <nav className="border-b p-6 bg-indigo-900">
        <p className="text-4xl font-bold text-white">IFI NFT Marketplace</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-white">
              Home
            </a>
          </Link>
          <Link href="/owned-nfts">
            <a className="mr-6 text-white">
              Owned NFTs
            </a>
          </Link>
          <Link href="/listed-nfts">
            <a className="mr-6 text-white">
              Listed NFTs
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
      <footer className="text-center text-white bg-indigo-700">
        <div className="text-center p-4 bg-indigo-900 mt-4">
        @2022 Marketplace for UZH Rooms
        </div>
      </footer>
    </div>
  )
}

export default MyApp
