import{ Link} from "react-router-dom"
const Header =({pn})=>{
    
    return (
        <div className='header'>
          <Link className="link" to='/' >
          <span>
              {pn}
          </span>
          </Link>
          
         
         
         <div>
          <ul className='menu'>

            <li>Home</li>
            <li>About</li>
{/* 
            <Link className="link" to='/demo'> 
             <li>Demo</li>
            </Link>
            
            <Link className="link" to='/state'> 
             <li>State Demo</li>
            </Link>
            <Link className="link" to='/students'>
            <li> Students page</li>

            </Link>
            <Link className="link" to='/useEffectdemo'>
            <li> Use Effect</li> 
             </Link>
             */}

           


          </ul>
         </div>
      </div>
    )
}
export default Header;