import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className='flex flex-col md:flex-row gap-6 bg-gradient-to-r from-blue-200'>
      <div className='p-6 bg-slate-300  shadow-md rounded-lg w-full md:w-1/4'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold text-lg'>Search Term:</label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full text-gray-700 focus:ring focus:ring-slate-300 focus:border-slate-500'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold text-lg'>Type:</label>
            <div className='flex gap-4'>
              <label className='flex items-center'>
                <input
                  type='radio'
                  id='all'
                  name='type'
                  className='form-radio h-5 w-5 text-slate-700'
                  onChange={handleChange}
                  checked={sidebardata.type === 'all'}
                />
                <span className='ml-2'>All</span>
              </label>
              <label className='flex items-center'>
                <input
                  type='radio'
                  id='rent'
                  name='type'
                  className='form-radio h-5 w-5 text-slate-700'
                  onChange={handleChange}
                  checked={sidebardata.type === 'rent'}
                />
                <span className='ml-2'>Rent/PG</span>
              </label>
              <label className='flex items-center'>
                <input
                  type='radio'
                  id='sale'
                  name='type'
                  className='form-radio h-5 w-5 text-slate-700'
                  onChange={handleChange}
                  checked={sidebardata.type === 'sale'}
                />
                <span className='ml-2'>Sale</span>
              </label>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  id='offer'
                  className='form-checkbox h-5 w-5 text-slate-700'
                  onChange={handleChange}
                  checked={sidebardata.offer}
                />
                <span className='ml-2'>Offer</span>
              </label>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold text-lg'>Amenities:</label>
            <div className='flex gap-4'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  id='parking'
                  className='form-checkbox h-5 w-5 text-slate-700'
                  onChange={handleChange}
                  checked={sidebardata.parking}
                />
                <span className='ml-2'>Parking</span>
              </label>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  id='furnished'
                  className='form-checkbox h-5 w-5 text-slate-700'
                  onChange={handleChange}
                  checked={sidebardata.furnished}
                />
                <span className='ml-2'>Furnished</span>
              </label>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold text-lg'>Sort By:</label>
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id='sort_order'
              className='border rounded-lg p-3 text-gray-700 focus:ring focus:ring-slate-300 focus:border-slate-500'
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to high</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:bg-slate-800 transition'>
            Search
          </button>
        </form>
      </div>
      <div className='flex-1'>
        <h1 className='text-3xl font-semibold text-slate-700 p-4 border-b'>
          Listing Results
        </h1>
        <div className='p-6 flex flex-wrap gap-6'>
          {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-600'>No listings found!</p>
          )}
          {loading && (
            <p className='text-xl text-slate-600 text-center w-full'>
              Loading...
            </p>
          )}

          {!loading &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className='text-slate-700 hover:text-slate-900 p-4 text-center w-full'
            >
              Show more..
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
