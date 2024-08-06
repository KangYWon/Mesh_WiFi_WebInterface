import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';

// project import
import MainCard from 'components/MainCard';
import { useSetActiveItem } from 'api/menu'; 

export default function Breadcrumbs({ navigation, title, ...others }) {
  const location = useLocation();
  const [main, setMain] = useState(null);
  const [item, setItem] = useState(null);

  const setActiveItem = useSetActiveItem(); // 서랍 상태를 업데이트하는 함수 (가정)

  // set active item state
  const getCollapse = (menu) => {
    if (menu.children) {
      menu.children.forEach((collapse) => {
        if (collapse.type === 'collapse') {
          getCollapse(collapse);
        } else if (collapse.type === 'item' && location.pathname === collapse.url) {
          setMain(menu);
          setItem(collapse);
        }
      });
    }
  };

  useEffect(() => {
    if (navigation?.items) {
      navigation.items.forEach((menu) => {
        if (menu.type === 'group') {
          getCollapse(menu);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleHomeClick = () => {
    setMain(null); // 상태 리셋
    setItem(null); // 상태 리셋
    setActiveItem(null); // 서랍 상태 리셋 (홈으로 이동 시 선택된 항목을 리셋)
  };

  let mainContent;
  let itemContent;
  let breadcrumbContent = <Typography />;
  let itemTitle = '';

  // collapse item
  if (main && main.type === 'collapse') {
    mainContent = (
      <Typography
        component={Link}
        to={main.url || '/'}
        variant="h6"
        sx={{ textDecoration: 'none' }}
        color="textSecondary"
      >
        {main.title}
      </Typography>
    );
  }

  // items
  if (item && item.type === 'item') {
    itemTitle = item.title;
    itemContent = (
      <Typography variant="subtitle1" color="textPrimary">
        {itemTitle}
      </Typography>
    );

    if (item.breadcrumbs !== false) {
      breadcrumbContent = (
        <MainCard border={false} sx={{ mb: 3, bgcolor: 'transparent' }} {...others} content={false}>
          <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
            <Grid item>
              <MuiBreadcrumbs aria-label="breadcrumb">
                <Link
                  to="/"
                  color="textSecondary"
                  variant="h6"
                  style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                  onClick={handleHomeClick} // 링크 클릭 시 상태 리셋
                >
                  <HomeIcon sx={{ mr: 0.5, color: 'gray' }} /> {/* 아이콘 추가 */}
                </Link>
                {mainContent}
                {itemContent}
              </MuiBreadcrumbs>
            </Grid>
            {title && (
              <Grid item sx={{ mt: 2 }}>
                <Typography variant="h5">{item.title}</Typography>
              </Grid>
            )}
          </Grid>
        </MainCard>
      );
    }
  }

  return breadcrumbContent;
}

Breadcrumbs.propTypes = {
  card: PropTypes.bool,
  custom: PropTypes.bool,
  divider: PropTypes.bool,
  heading: PropTypes.string,
  icon: PropTypes.bool,
  icons: PropTypes.bool,
  links: PropTypes.array,
  maxItems: PropTypes.number,
  rightAlign: PropTypes.bool,
  separator: PropTypes.any,
  title: PropTypes.bool,
  titleBottom: PropTypes.bool,
  sx: PropTypes.any,
  others: PropTypes.any
};