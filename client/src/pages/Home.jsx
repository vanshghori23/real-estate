import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div className='bg-gradient-to-r from-blue-200 min-h-screen'>
      {/* Top Section */}
      <div className='flex flex-col gap-6 p-10 md:p-20 max-w-6xl mx-auto'>
        <h1 className='text-slate-800 font-bold text-3xl lg:text-5xl'>
        Find Your Perfect Place,
          <br />
          Because Every <span className='text-blue-600'>"SquareFeet"</span> Matters!
        </h1>
        <p className='text-gray-900 text-sm md:text-base'>
         SquareFeet...Connecting you with the perfect place to call home.
          <br />
        </p>
        <Link
          to={'/search'}
          className='inline-block text-sm md:text-md text-blue-800 font-bold hover:underline transition'
        >
          Let's get started...
        </Link>
      </div>

      <div className='overflow-hidden rounded-lg shadow-lg mx-4 sm:mx-8 lg:mx-16'>
  <Swiper navigation>
    {offerListings && offerListings.length > 0 && 
      offerListings.map((listing) => (
        <SwiperSlide key={listing._id}>
          <div
            style={{
              background: `url(${listing.imageUrls[0]}) center no-repeat`,
              backgroundSize: 'cover',
            }}
            className='h-[500px] rounded-lg'
          ></div>
        </SwiperSlide>
      ))
    }
  </Swiper>
</div>


      {/* Listing Results for Offer, Sale, and Rent */}
      <div className='max-w-6xl mx-auto p-6 flex flex-col gap-10 my-10'>
        {offerListings.length > 0 && (
          <div className='bg-slate-300 shadow-md rounded-lg p-4'>
            <h2 className='text-2xl font-semibold text-slate-700'>Recent Offers</h2>
            <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            <div className='flex flex-wrap gap-4 mt-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings.length > 0 && (
          <div className='bg-slate-300 shadow-md rounded-lg p-4'>
            <h2 className='text-2xl font-semibold text-slate-700'>Recent Places for Rent</h2>
            <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
            <div className='flex flex-wrap gap-4 mt-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings.length > 0 && (
          <div className='bg-slate-300 shadow-md rounded-lg p-4'>
            <h2 className='text-2xl font-semibold text-slate-700'>Recent Places for Sale</h2>
            <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
            <div className='flex flex-wrap gap-4 mt-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
