import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  return (
    <header className='bg-zinc-400 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                <span className='text-gray-600'>Square</span>
                <span className='text-gray-800'>Feet</span>
            </h1>
        </Link>
            <form className='bg-stone-300 p-3 rounded-lg flex items-center'>
                <input type="text" placeholder="Search..." 
                className='bg-transparent focus:outline-none w-24 sm:w-64' />
                <FaSearch className='text-slate-600' />
            </form>
            <ul className='flex gap-8'>
            <Link to='/'>
                <li className='hidden sm:inline text-slate-950 hover:underline'>
                    Home
                </li>
            </Link>
            <Link to='/sign-in'>
                <li className='text-slate-950 hover:underline'>
                    Sign In
                </li>
            </Link>
            <Link to='/about'>
                <li className='hidden sm:inline text-slate-950 hover:underline'>
                    About
                </li>
            </Link>
        
            </ul>
        </div>
    </header>
  );
}
 