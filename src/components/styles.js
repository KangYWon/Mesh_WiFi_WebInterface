// src/styles.js
export const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: 'green',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'green !important',
        boxShadow: '0 0 0 2px rgba(190, 227, 43, 0.3) !important',
      },
    },
    '& .MuiInputLabel-root': {
      '&.Mui-focused': {
        color: 'green !important',
      },
    },
  };
  
  export const buttonStyles = {
    backgroundColor: 'green',
    color: 'white',
    '&:hover': {
      backgroundColor: 'darkgreen',
    },
    '&::after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      width: '100%',
      height: '100%',
      boxShadow: '0 0 5px 5px rgba(0, 255, 0, 0.9)',
      borderRadius: 'inherit',
      pointerEvents: 'none',
    },
  };
  
  export const clearButtonStyles = {
    marginTop: 2,
    borderColor: 'black',
    color: 'black',
    '&:hover': {
      borderColor: 'black',
      color: 'black',
    },
    '&::after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      width: '100%',
      height: '100%',
      boxShadow: '0 0 5px 5px rgba(0, 0, 0, 0.9)',
      borderRadius: 'inherit',
      pointerEvents: 'none',
    },
  };
  
  export const analyticsButtonStyles = {
    marginTop: 2,
    borderColor: 'green',
    color: 'green',
    '&:hover': {
      borderColor: 'darkgreen',
      color: 'darkgreen',
    },
    '&::after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      width: '100%',
      height: '100%',
      boxShadow: '0 0 5px 5px rgba(0, 255, 0, 0.9)',
      borderRadius: 'inherit',
      pointerEvents: 'none',
    },
  };