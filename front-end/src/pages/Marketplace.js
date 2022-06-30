import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Nftcard from '../components/Nftcard'
import { MessageContext } from '../context/store';
import Loading from '../components/Loading';
import './Marketplace.css'

export default function Marketplace() {
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { notify } = useContext(MessageContext)

  useEffect(()=> {
    getNfts()
  },[])

  const getNfts = () => {
    setIsLoading(true);
    axios.request({
      method: 'get',
      url: 'https://olog445.herokuapp.com/offchain/nftmarket/allNFT',
      withCredentials: true
    })
    .then((res)=>{
      setNfts(res.data)
      console.log(res.data)
      setIsLoading(false);
    })
    .catch((err) => {
      setIsLoading(false);
      notify('마켓플레이스를 불러올 수 없습니다')
      console.log(err)})
  }
  
  return (
    <div className='marketplace'>
      <div className='typo'>
        <div>만년필 구매 후 보상을 강화해보세요</div>
      </div>
      <div className='container'>
        {nfts.map((el, idx) => {
          return <Nftcard key={idx} 
            name={el.name} 
            description={el.description} 
            image={el.image} 
            NFTrewardFactor={el.NFTrewardFactor}
            tokenURI={el.tokenURI}
            price={el.price}
            attributes={el.attributes}
            />
        })}
      </div>
      {isLoading ? <Loading /> : ''}
    </div>
  )
}
