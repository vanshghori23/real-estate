import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
    const { currentUser } = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (e) => {
      e.preventDefault();
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set('searchTerm', searchTerm);
      const searchQuery = urlParams.toString();
      navigate(`/search?${searchQuery}`);
    };

    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const searchTermFromUrl = urlParams.get('searchTerm');
      if (searchTermFromUrl) {
        setSearchTerm(searchTermFromUrl);
      }
    }, [location.search]);

  return (
    <header className='bg-zinc-400 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                <span className='text-gray-600'>Square</span>
                <span className='text-gray-800'>Feet</span>
            </h1>
        </Link>
            <form onSubmit={handleSubmit} className='bg-stone-300 p-3 rounded-lg flex items-center'>
                <input type="text" placeholder="Search..." 
                className='bg-transparent focus:outline-none w-24 sm:w-64' 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button>
                  <FaSearch className='text-slate-600' />
                </button>
            </form>
            <ul className='flex gap-8'>
            <Link to='/'>
                <li className='hidden sm:inline text-slate-950 hover:underline'>
                    Home
                </li>
            </Link>
            <Link to='/about'>
                <li className='hidden sm:inline text-slate-950 hover:underline'>
                    About
                </li>
            </Link>
            <Link to='/profile'>
            {currentUser ? (
              <img
                className='rounded-full h-6 w-6 object-cover'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              <li className=' text-slate-700 hover:underline'> Sign in</li>
            )}
          </Link>
            </ul>
        </div>
    </header>
  );
}
 