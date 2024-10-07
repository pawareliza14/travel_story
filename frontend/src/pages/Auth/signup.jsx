import React, { useState } from 'react'
import PasswordInput from '../../components/Input/PasswordInput';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
const SignUp = () => {
  const [name,setName]= useState("");
  const [email,setEmail]= useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState(null);

  const navigate=useNavigate()

  const handleSignUp=async (e) => {
    e.preventDefault();

    if(!name){
      setError("Please enter your name.");
      return;
    }

    if(!password){
      setError("Please enter the password");
      return;
    }
  };

  // setError("");

  //Login API


  return (
    <div className='h-screen bg-cyan-50 overflow-hidden relative'>
      <div className='login-ui-box right-10 -top-40'></div>
      <div className='login-ui-box bg-cyan-200 -bottom-40 right-1/2'></div>
      <div className='container h-screen flex items-center justify-center px-20 mx-auto'>
        <div className='w-2/4 h-[90vh] flex items-end bg-signup-bg-img bg-cover bg-center rounded-lg p-10 z-50'>
          <div>
            <h4 className='text-5xl text-white font-semibold leading-[58px]'>
              Join the  <br />Adventure
            </h4>
            <p className='text-[15px] text-white leading-6 pr-7 mt-4'>
                Createe an account to star documentiong your travel and preserving your memories in your personal travel journal.           </p>
          </div>
        </div>

        <div className='w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-lg shadow-cyan-200/20'>
          <form onSubmit={handleSignUp}>
            <h4 className='text-2xl font-semibold mb-7'>SignUp</h4>

            <input type="text" placeholder='Full Name' className='input-box' 
            value={email}
            onChange={({target})=>{
              setName(target.value);
            }}
            />

            <input type="text" placeholder='Email' className='input-box' 
            value={email}
            onChange={({target})=>{
              setEmail(target.value);
            }}
            />

            <PasswordInput value={password}
            onChange={({target})=>{
              setPassword(target.value);
            }}/>

            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

            <button type='submit' className='btn-primary'>
              CREATE ACCOUNT
              </button>

            <p className='text-xs text-slate-500 text-center my-4'>Or</p>

            <button type='submit'
            className='btn-primary btn-light'
            onClick={()=>{
              navigate("/signUp");
            }}>
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp
