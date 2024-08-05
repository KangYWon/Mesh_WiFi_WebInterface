// material-ui
import { useTheme } from '@mui/material/styles';
import logo from 'assets/images/icons/midbar.svg'; // 새로운 로고 파일 import


/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = ({isIcon, sx}) => {
  const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={logo} alt="Mantis" width="100" />
     *
     */
    <>
      <img src={logo} alt="Network" width="50px" />
      
    </>
  );
};

export default Logo;
