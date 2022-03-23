/* pages/_app.js */
import '../styles/globals.css'
import Link from 'next/link'

const MyApp = ({ Component, pageProps }) => {
  return (
    <div>
      <nav className="border-b p-6 bg-slate-800">
        <p className="text-4xl font-bold text-white">IFI NFT Marketplace</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-blue-500">
              Home
            </a>
          </Link>
          <Link href="/owned-nfts">
            <a className="mr-6 text-blue-500">
              Owned NFTs
            </a>
          </Link>
          <Link href="/listed-nfts">
            <a className="mr-6 text-blue-500">
              Listed NFTs
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
