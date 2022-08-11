import React from 'react'
import Navbar from '../components/Navbar'
import StorageHelper from '../utils/StorageHelper';

export default function AdminProfile() {
  let logoutButton = (e)=>{
    e.preventDefault();
    StorageHelper.remove("token");
    window.location.href="/login";
  }

  return (
    <div className='page-position-default'>
        <Navbar/>
        <button type="button" class="btn btn-danger mx-4 my-4 " onClick={logoutButton}>Logout</button>
    </div>
  )
}
