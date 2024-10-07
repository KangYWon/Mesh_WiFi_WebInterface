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
      boxShadow: '0 0 5px 5px rgba(117, 224, 63, 0.9)',
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
      backgroundColor: 'rgba(0, 0, 0, 0.1)', // 클릭했을 때와 동일한 색상 추가
    },
    '&:active': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)', // 클릭 시 색상 설정
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
      backgroundColor: 'rgba(117, 224, 63, 0.1)', // 클릭했을 때와 동일한 색상 추가
    },
    '&:active': {
      backgroundColor: 'rgba(117, 224, 63, 0.1)', // 클릭 시 색상 설정
    },
    '&::after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      width: '100%',
      height: '100%',
      boxShadow: '0 0 5px 5px rgba(117, 224, 63, 0.9)',
      borderRadius: 'inherit',
      pointerEvents: 'none',
    },
  };

  export const stopButtonStyles = {
    borderColor: 'black', // 기본 테두리 색상
    color: 'black', // 기본 텍스트 색상
    '&:hover': {
      borderColor: 'red',
      color: 'red',
    },
    '&:active': {
      borderColor: 'red',
      color: 'white',
      backgroundColor: 'red',
    },
    '&::after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      width: '100%',
      height: '100%',
      boxShadow: '0 0 5px 5px rgba(230, 96, 96, 0.9)',
      borderRadius: 'inherit',
      pointerEvents: 'none',
    },
    position: 'relative', // Absolute positioning of the after pseudo-element
  };

  export const activeStopButtonStyles = {
    backgroundColor: 'red !important',
    color: 'white !important',
    borderColor: 'red !important',
    '&::after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      width: '100%',
      height: '100%',
      boxShadow: '0 0 5px 5px rgba(230, 96, 96, 0.9)',
      borderRadius: 'inherit',
      pointerEvents: 'none',
    },
  };
  