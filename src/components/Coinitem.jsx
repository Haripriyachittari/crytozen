import React, { useState } from 'react'
import {AiOutlineStar,AiFillStar} from 'react-icons/ai'
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { Link } from 'react-router-dom';
import { UserAuth } from '../context/Authcontext';
import { db } from '../firebase';
import {arrayUnion,doc,updateDoc} from 'firebase/firestore';

const Coinitem = ({coin}) => {
  const [saved,setSaved]=useState(false);
  const {user}=UserAuth();

  const coinPath = doc(db, 'users', `${user?.email}`);
  const saveCoin = async () => {
    if (user?.email) {
      setSaved(true);
      await updateDoc(coinPath, {
        watchList: arrayUnion({
          id: coin.id,
          name: coin.name,
          image: coin.image,
          rank: coin.market_cap_rank,
          symbol: coin.symbol,
        }),
      });
    } else {
      alert('Please sign in to save a coin to your watch list');
    }
  };

 
  return (
    <tr className='h-[80px] border-b overflow-hidden'>
                    <td onClick={saveCoin}>
                      {saved ?   <AiFillStar/>:<AiOutlineStar/>}
                    </td>
                    <td>{coin.market_cap_rank}</td>
                    <td>
                        <Link to ={`/coin/${coin.id}`}>
                        <div className='flex items-center'>
                        <img src={coin.image} alt={coin.id} className='w-6 m-2 rounded-full'/>
                        <p className='hidden sm:table-cell'>{coin.name}</p>
                        </div>
                        </Link>
                    </td>
                    <td>{(coin.symbol).toUpperCase()}</td>
                    <td>${coin.current_price.toLocaleString()}</td>

                    <td >
                    {coin.price_change_percentage_24h > 0 ? <p className='text-green-600'>{(coin.price_change_percentage_24h).toFixed(2)}%</p>: <p className='text-red-600'>{(coin.price_change_percentage_24h).toFixed(2)}%</p> }
                        </td>
                    <td className='w-[180px] hidden sm:table-cell'>${coin.total_volume.toLocaleString()}</td>
                    <td className='w-[180px] hidden md:table-cell'>${coin.market_cap.toLocaleString()}</td>
                    <td><Sparklines data={coin.sparkline_in_7d.price}>
                        <SparklinesLine color='teal'/>
                        </Sparklines></td>
                  </tr>
  )
}

export default Coinitem
