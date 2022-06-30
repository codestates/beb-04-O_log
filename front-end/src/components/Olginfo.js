import './Olginfo.css'

export default function OLGinfo(props) {

  return (
    <div className='olg_info'>
        <div className='olg_element sub'>total</div>
        <div className='olg_element big'>{props.myOLG} OLG</div>
        <div className='olg_element sub'>사용가능한 OLG {props.received}</div>
        <div className='olg_element section'>
          <button onClick={props.handleSync}>sync</button>
        </div>
    </div>
  )
}
