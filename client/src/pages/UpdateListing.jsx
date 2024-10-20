import { useEffect, useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    kitchen: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, [params.listingId]);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/update/' + params.listingId, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className='bg-gradient-to-r from-blue-200 min-h-screen flex items-center justify-center'>
      <div className='p-8 w-full max-w-4xl bg-gray-50 shadow-lg rounded-lg'>
        <h1 className='text-4xl font-bold text-gray-800 mb-6 text-center'>Update a Listing</h1>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
          <div className='flex flex-col gap-4 flex-1'>
            <input
              type='text'
              placeholder='Name'
              className='border p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 mb-4 w-full'
              id='name'
              maxLength='62'
              minLength='10'
              required
              onChange={handleChange}
              value={formData.name}
            />
            <textarea
              placeholder='Description'
              className='border p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 mb-4 w-full'
              id='description'
              required
              onChange={handleChange}
              value={formData.description}
            />
            <input
              type='text'
              placeholder='Address'
              className='border p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 mb-4 w-full'
              id='address'
              required
              onChange={handleChange}
              value={formData.address}
            />
            <div className='flex gap-6 flex-wrap mb-4'>
              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='sale'
                  className='w-5 h-5'
                  onChange={handleChange}
                  checked={formData.type === 'sale'}
                />
                <span>Sell</span>
              </div>
              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='rent'
                  className='w-5 h-5'
                  onChange={handleChange}
                  checked={formData.type === 'rent'}
                />
                <span>Rent/PG</span>
              </div>
              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='parking'
                  className='w-5 h-5'
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <span>Parking spot</span>
              </div>
              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='furnished'
                  className='w-5 h-5'
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <span>Furnished</span>
              </div>
              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='offer'
                  className='w-5 h-5'
                  onChange={handleChange}
                  checked={formData.offer}
                />
                <span>Offer</span>
              </div>
            </div>
            <div className='flex flex-wrap gap-6 mb-4'>
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='bedrooms'
                  min='1'
                  max='10'
                  required
                  className='p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300'
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
                <p>Beds</p>
              </div>
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='kitchen'
                  min='1'
                  max='10'
                  required
                  className='p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300'
                  onChange={handleChange}
                  value={formData.kitchen}
                />
                <p>Kitchen</p>
              </div>
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='bathrooms'
                  min='1'
                  max='10'
                  required
                  className='p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300'
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
                <p>Bathrooms</p>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-4 flex-1'>
            <div className='flex flex-col gap-2'>
              <label className='text-gray-500'>Regular Price</label>
              <input
                type='number'
                id='regularPrice'
                required
                min='50'
                max='10000000'
                className='border p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 mb-4'
                onChange={handleChange}
                value={formData.regularPrice}
              />
            </div>
            {formData.offer && (
              <div className='flex flex-col gap-2'>
                <label className='text-gray-500'>Discount Price</label>
                <input
                  type='number'
                  id='discountPrice'
                  required
                  min='0'
                  max='10000000'
                  className='border p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 mb-4'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
              </div>
            )}
            <div>
              <label className='text-gray-500'>
                Images (Max 6) (each image must be less than 2mb)
              </label>
              <input
                type='file'
                accept='image/*'
                multiple
                required={formData.imageUrls.length < 1}
                onChange={(e) => setFiles(e.target.files)}
                className='border p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 mb-4'
              />
              <button
                type='button'
                onClick={handleImageSubmit}
                className='bg-blue-500 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 mb-4 w-full'
              >
                Upload
              </button>
            </div>
            <div className='flex gap-4 flex-wrap'>
              {formData.imageUrls.map((url, index) => (
                <div
                  key={index}
                  className='relative border border-gray-300 rounded-lg overflow-hidden'
                >
                  <img
                    src={url}
                    alt='uploaded'
                    className='w-32 h-32 object-cover'
                  />
                  <button
                    type='button'
                    onClick={() => handleRemoveImage(index)}
                    className='absolute top-0 right-0 bg-red-500 text-white p-2 rounded-bl-lg'
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
            {uploading && <p className='text-blue-500'>Uploading...</p>}
            {imageUploadError && (
              <p className='text-red-500'>{imageUploadError}</p>
            )}
          </div>
        </form>
        <div className='flex justify-center mt-6'>
          <button
            type='submit'
            onClick={handleSubmit}
            className='bg-green-500 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 w-full'
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Listing'}
          </button>
        </div>
        {error && <p className='text-red-500 text-center mt-4'>{error}</p>}
      </div>
    </div>
  );
}
