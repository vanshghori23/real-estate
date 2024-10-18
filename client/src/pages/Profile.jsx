import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  
  return (
    <div className='bg-gradient-to-r from-blue-100 to-white min-h-screen flex items-center justify-center'>
  <div className='p-8 w-full max-w-md bg-gray-50 shadow-lg rounded-lg'>
    <h1 className='text-4xl font-bold text-gray-800 mb-6 text-center'>Profile</h1>
    <form onSubmit={handleSubmit} className='flex flex-col'>
      <input
        onChange={(e) => setFile(e.target.files[0])}
        type='file'
        ref={fileRef}
        hidden
        accept='image/*'
      />
      <div className='flex flex-col items-center mb-4'>
        <img 
          onClick={() => fileRef.current.click()} 
          src={formData.avatar || currentUser.avatar} 
          alt="profile"
          className='rounded-full h-32 w-32 object-cover cursor-pointer border-4 border-gray-300 transition duration-300 hover:border-blue-400 mb-3 shadow-md'
        />
        <p className='text-center text-sm text-gray-600'>
          {fileUploadError ? (
            <span className='text-red-600'>
              Error uploading image (must be less than 2 MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-gray-600'>{`Uploading... ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-600'>Image uploaded successfully!</span>
          ) : null}
        </p>
      </div>
      <input
        type='text'
        placeholder='Username'
        defaultValue={currentUser.username}
        id='username'
        className='border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 mb-4 w-full'
        onChange={handleChange}
        required
      />
      <input
        type='email'
        placeholder='Email'
        id='email'
        defaultValue={currentUser.email}
        className='border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 mb-4 w-full'
        onChange={handleChange}
        required
      />
      <input
        type='password'
        placeholder='Password'
        onChange={handleChange}
        id='password'
        className='border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 mb-6 w-full'
      />
      <button
        disabled={loading}
        className='w-full bg-blue-600 text-white rounded-lg p-4 uppercase hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 mb-4'
      >
        {loading ? 'Loading...' : 'Update'}
      </button>
      <Link
        className='w-full bg-gray-800 text-white p-4 rounded-lg uppercase text-center hover:bg-gray-700 transition duration-300'
        to={'/create-listing'}
      >
        Create Your Listing
      </Link>
    </form>
    <div className='flex justify-between w-full mt-6'>
      <span
        onClick={handleDeleteUser}
        className='text-red-600 cursor-pointer hover:underline'
      >
        Delete Account?
      </span>
      <span onClick={handleSignOut} className='text-red-600 cursor-pointer hover:underline'>
        Sign Out
      </span>
    </div>
    <p className='text-red-600 mt-4'>{error ? error : ''}</p>
    <p className='text-green-600 mt-4'>
      {updateSuccess ? 'User updated successfully!' : ''}
    </p>
  </div>
</div>

  );
}
