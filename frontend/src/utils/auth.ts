// Authentication utility functions

export const setAuthData = (token: string, user: any, userType: 'student' | 'alumni') => {
  try {
    console.log('Setting auth data:', { token: token.substring(0, 20) + '...', user, userType });
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userType', userType);
    console.log('Auth data saved successfully');
  } catch (error) {
    console.error('Error saving auth data:', error);
  }
};

export const getAuthData = () => {
  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const userType = localStorage.getItem('userType');
    
    console.log('Getting auth data:', {
      hasToken: !!token,
      hasUser: !!userStr,
      userType
    });
    
    return {
      token,
      user: userStr ? JSON.parse(userStr) : null,
      userType
    };
  } catch (error) {
    console.error('Error getting auth data:', error);
    return { token: null, user: null, userType: null };
  }
};

export const clearAuthData = () => {
  console.log('Clearing auth data');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userType');
};

export const isAuthenticated = () => {
  const { token, user } = getAuthData();
  const isAuth = !!(token && user);
  console.log('Is authenticated:', isAuth);
  return isAuth;
};
