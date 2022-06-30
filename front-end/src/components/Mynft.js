import React from 'react'
import Nftcard from './Nftcard'
import './Mynft.css'


export default function Mynft(props) {

  console.log(props.nfts)
  const nfts = props.nfts //내 nft 요청
  return (
    <div className='mynfts'>
      <div className='mynfts_container'>
        {nfts.map((el, idx) => {
          return <Nftcard key={idx} name={el.name} description={el.description} image={el.image} NFTrewardFactor={el.NFTrewardFactor} tokenId={el.tokenId} tokenURI={el.tokenURI} attributes={el.attributes}/>
        })}
      </div>
    </div>
  )
}
