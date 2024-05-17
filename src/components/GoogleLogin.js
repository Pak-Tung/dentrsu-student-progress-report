import React, { useState, useEffect, useCallback } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from '../pages/students/Profile';
import { getStudentByEmail } from '../features/apiCalls';

function GoogleLogin() {
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get('user');
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const [profile, setProfile] = useState(() => {
    const savedUser = Cookies.get('user');
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const [isExist, setIsExist] = useState(false);

  const handleSuccess = useCallback((codeResponse) => {
    setUser(codeResponse);
    console.log('codeResponse', codeResponse);
  }, []);

  const handleError = useCallback((error) => {
    console.log('Login Failed:', error);
  }, []);

  const login = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  useEffect(() => {
    if (user && Object.keys(user).length !== 0) {
      axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            Accept: 'application/json',
          },
        })
        .then(async (res) => {
          setProfile(res.data);
          console.log('res.email', res.data.email);
          try {
            const result = await getStudentByEmail(res.data.email);
            Cookies.set('user', JSON.stringify(res.data), { expires: 7 });
            console.log('ResultIsUserExist', result[0].studentEmail);
            setIsExist(true);
          } catch (err) {
            console.log('Error: ', err);
            alert('User not Found!!');
            logOut();
          }
        })
        .catch((err) => {
          console.log('axiosError', err);
        });
    }
  }, [user]);

  const logOut = useCallback(() => {
    googleLogout();
    setUser({});
    setProfile({});
    setIsExist(false);
    Cookies.remove('user');
  }, []);

  return (
    <>
      {profile.email === undefined ? (
        <>
        <div className='d-flex justify-content-center'>
          <h2>Online Requirements</h2>
          </div>
            <br />
          <div className="d-flex justify-content-center">
          <button onClick={() => login()}>Sign in with Google</button>
        </div>
        </>
      ) : (
        <>
          <Profile user={profile} />
          <div className='d-flex justify-content-center'>
            <div className='card' style={{ width: '18rem' }}>
              <div className='card-footer'>
                <div className='d-grid gap-2 col-12 mx-auto'>
                  <button className='btn btn-outline-danger' onClick={logOut}>
                    Log out
                  </button>
                </div>
              </div>
            </div>
          </div>
          {console.log('Profile', profile.email)}
        </>
      )}
    </>
  );
}

export default GoogleLogin;

// import React, { useState, useEffect } from 'react';
// import { googleLogout, useGoogleLogin } from '@react-oauth/google';
// //import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Cookies from 'js-cookie';

// import 'bootstrap/dist/css/bootstrap.min.css';
// //import { Link } from 'react-router-dom';
// import Profile from '../pages/students/Profile';
// import { getStudentByEmail } from '../features/apiCalls';
// //import Navbar from './Navbar';


// function GoogleLogin() {

//     Cookies.get('user') === undefined ? Cookies.set('user', JSON.stringify({})): console.log('User exists');
//     const [ user, setUser ] = useState(JSON.parse(Cookies.get('user')));
//     const [ profile, setProfile ] = useState(JSON.parse(Cookies.get('user')));
//     const [ isExist, setIsExist ] = useState(false);

    


//     const login = useGoogleLogin({
//         onSuccess: (codeResponse) => {
//             setUser(codeResponse);
//             console.log('codeResponse', codeResponse);
//         },
//         onError: (error) => console.log('Login Failed:', error)
//     });

    
 
//     useEffect(
//         () => {
//             if (user !== null && Object.keys(user).length !== 0){
                
//                 axios
//                     .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
//                         headers: {
//                             Authorization: `Bearer ${user.access_token}`,
//                             Accept: 'application/json'
//                         }
//                     })
//                     .then((res) => {
                        
//                         setProfile(res.data);
//                         console.log('res.email', res.data.email);
//                         const isUserExist = async () => {
//                             console.log('profile.email', profile);
//                             try{
//                             const result = await getStudentByEmail(res.data.email);
//                                 Cookies.set('user', JSON.stringify(res.data),{ expires: 7 });
//                                 console.log('ResultIsUserExist', result[0].studentEmail);
//                                 setIsExist(true);
//                                 return true;
//                             } catch (err){
//                                 console.log('Error: ', err);
//                                 alert("User not Found!!");
//                                 logOut();
//                                 return false;
//                             }
//                         }

//                         isUserExist();



//                         console.log('isUserExist', isExist);
                        
//                     })
//                     .catch((err) => {
//                         console.log('axiosError', err)
//                     });
//             }
//         },
//         [user]
//     );

//     // log out function to log the user out of google and set the profile array to null
//     const logOut = () => {
//         googleLogout();
//         setUser({});
//         setProfile({});
//         setIsExist(false)
//         Cookies.remove('user');
//     };

//     return (    
//     <> 
            
//             {/* {profile === null || Object.keys(user).length === 0  */}
//             {profile.email===undefined ? (
//                 <>
//                 <div className='d-flex justify-content-center'>
//                 <h2>Online Requirements</h2>
//                 </div>
//                 <br />
//                 <div className="d-flex justify-content-center">
//                 <button onClick={() => login()}>Sign in with Google </button>
//                 </div>
//                 </>
//             ) : (
//                 <>
//                 {/* <Navbar user={profile} /> */}
//                 {/* <div className='d-flex justify-content-center'>
//                 <h2>Online Requirements</h2>
//                 </div>
//                 <br /> */}
//                 <Profile user={profile} />
//                 <div className="d-flex justify-content-center">
//                 <div className="card" style={{ width: "18rem" }}>
//                     <div className="card-footer">
//                         <div className="d-grid gap-2 col-12 mx-auto">
//                         <button className="btn btn-outline-danger" onClick={logOut}>Log out</button>
//                         </div>
//                     </div>
//                 </div>
//                 </div>
//                 {console.log('Profile', profile.email)}
//                 </>
                
//             )}
//         </>
//     );
// }

// export default GoogleLogin;