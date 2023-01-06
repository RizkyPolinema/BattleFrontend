import React, {useState, useEffect} from 'react'
import AuthService from '../services/auth.service'
import UserService from '../services/user.service';

function CTA() {
    
    const [currentUser, setCurrentUser] = useState()

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            UserService.getUserById(user.uid).then(res => {
                setCurrentUser(res.data.data);
            }, (error => {
                console.log("Private page", error.response);
                // Invalid token
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  return (
    <div
      className="flex items-center justify-between p-4 mb-8 text-sm font-semibold text-blue-100 bg-custom-secondary rounded-lg shadow-md focus:outline-none focus:shadow-outline-blue"
    >
      <div className="flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
        <span>Selamat Datang {currentUser && currentUser.nama}</span>
      </div>
      {/* <span>
        View more <span dangerouslySetInnerHTML={{ __html: '&RightArrow;' }}></span>
      </span> */}
    </div>
  )
}

export default CTA
