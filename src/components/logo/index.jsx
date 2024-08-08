/**
 * 이 컴포넌트는 일반적으로 상단 바 또는 사이드바와 같은 전역 레이아웃에서 사용되며, 
 * 애플리케이션의 로고와 버전 정보를 일관되게 표시, 클릭 가능하게 만듦
 * 
 * bar 안에 있는 Navigation 로고 임. 
 */

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase } from '@mui/material';
import Stack from '@mui/material/Stack';
import { handlerActiveItem } from 'api/menu'; // 상태 업데이트를 위한 함수 임포트

// project import
import Logo from './LogoMain'; //실제 로고 이미지 사용, 구현하는 파일
import config from 'config';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = ({ sx, to }) => {
  const handleClick = () => {
    // 'Dashboard'만 선택되도록 상태를 업데이트합니다.
    handlerActiveItem('dashboard');
  };

  return (
    <ButtonBase 
      disableRipple 
      component={Link} 
      to={!to ? config.defaultPath : to} 
      sx={{
        ...sx, // 기존의 sx 스타일을 유지
        transform: 'translateY(13px)' // 아래로 10px 이동
      }}
      onClick={handleClick} // 클릭 시 상태를 업데이트하는 핸들러 호출
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Logo />
      </Stack>
    </ButtonBase>
  );
};

LogoSection.propTypes = {
  sx: PropTypes.object,
  to: PropTypes.string
};

export default LogoSection;