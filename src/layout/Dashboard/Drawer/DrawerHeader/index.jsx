import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

// project import
import DrawerHeaderStyled from './DrawerHeaderStyled';
import Logo from 'components/logo';

// ==============================|| DRAWER HEADER ||============================== //

export default function DrawerHeader({ open }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: 2,
        justifyContent: open ? 'flex-start' : 'center',
        transition: 'justify-content 0.3s', // 드로어 열리고 닫힐 때의 전환
        width: '100%' // 전체 너비를 차지하게
      }}
    >
      {/* 로고 조건부 렌더링 */}
      <Box
        sx={{
          display: open ? 'block' : 'none', // 드로어가 열릴 때만 큰 로고 보이기
          transition: 'display 0.3s',
        }}
      >
        <Logo sx={{ width: 50, height: 40 }} /> {/* 큰 로고 */}
      </Box>
      <Box
        sx={{
          display: !open ? 'block' : 'none', // 드로어가 닫힐 때만 작은 로고 보이기
          transition: 'display 0.3s',
        }}
      >
        <Logo sx={{ width: 35, height: 35 }} /> {/* 작은 로고 */}
      </Box>
      <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
      </Box>
    </Box>
  );
}


DrawerHeader.propTypes = { open: PropTypes.bool };
