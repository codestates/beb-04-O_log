import Card from './Card'
import { useEffect, useState } from 'react';
import './MyPosts.css'

export default function MyPosts({myPosts}) {

  //const [page, setPage] = useState(myPosts.slice(0, 10));


  return (
    <div className='mypage_posts'>
    <div className='title'>Posts</div>
    <div className='mypost_container'>
      {myPosts.map((el, idx) => {
        return <Card key={idx} postImageUrl={el.postImageUrl} blogLink={el.blogLink} title={el.title} created_at={el.created_at} username={el.username} faviconUrl={el.faviconUrl}/>
      })}
    </div>
    <div className='page_area'>
    </div>
  </div>
  )
}
