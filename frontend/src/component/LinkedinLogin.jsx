import React, { useState } from 'react';
import { LinkedIn } from 'react-linkedin-login-oauth2';

const LinkedinLogin = () => {
  const [userDetails, setUserDetails] = useState(null);

  const handleSuccess = (data) => {
    console.log('LinkedIn login success:', data);
    fetch(`https://api.linkedin.com/v2/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${data.code}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserDetails(data);
      })
      .catch((error) => console.error('Error fetching user details:', error));
  };

  const handleError = (error) => {
    console.error('LinkedIn login failed:', error);
  };

  return (
    <div>
      <h2>LinkedIn Login</h2>
      <LinkedIn
        clientId="77ois5x1r5sf6a"
        redirectUri="YOUR_REDIRECT_URI"
        onSuccess={handleSuccess}
        onFailure={handleError}
      />
      {userDetails && (
        <div>
          <h3>User Details:</h3>
          <pre>{JSON.stringify(userDetails, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default LinkedinLogin;
