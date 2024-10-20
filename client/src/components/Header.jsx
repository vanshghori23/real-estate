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
        <header className='bg-white shadow-lg'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-4'>
                <Link to='/'>
                    <h1 className='font-bold text-xl flex flex-wrap'>
                        <span className='text-blue-600'>Square</span>
                        <span className='text-gray-800'>Feet</span>
                    </h1>
                </Link>
                <form onSubmit={handleSubmit} className='bg-gray-100 p-2 rounded-lg flex items-center shadow-md'>
                    <input
                        type="text"
                        placeholder="Search..."
                        className='bg-transparent focus:outline-none w-32 sm:w-64 p-2'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className='p-2'>
                        <FaSearch className='text-blue-600 hover:text-blue-800 transition' />
                    </button>
                </form>
                <ul className='flex gap-6'>
                    <Link to='/'>
                        <li className='text-gray-800 hover:text-blue-600 transition'>Home</li>
                    </Link>
                    <Link to='/about'>
                        <li className='text-gray-800 hover:text-blue-600 transition'>About</li>
                    </Link>
                    <Link to='/profile'>
                        {currentUser ? (
                            <img
                                className='rounded-full h-8 w-8 object-cover border-2 border-blue-600'
                                src={currentUser.avatar}
                                alt='profile'
                            />
                        ) : (
                            <li className='text-gray-800 hover:text-blue-600 transition'>Sign in</li>
                        )}
                    </Link>
                </ul>
            </div>
        </header>
    );
}
