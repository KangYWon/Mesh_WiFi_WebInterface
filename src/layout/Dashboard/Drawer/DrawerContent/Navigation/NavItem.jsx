import PropTypes from 'prop-types';
import { forwardRef, useEffect } from 'react';
import { Link, useLocation, matchPath } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// project import
import { handlerActiveItem, useGetMenuMaster } from 'api/menu';

export default function NavItem({ item, level }) {
  const theme = useTheme();

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const openItem = menuMaster.openedItem;
  const { pathname } = useLocation();

  const isSelected = !!matchPath({ path: item.url, end: false }, pathname) || openItem === item.id;

  // active menu item on page load
  useEffect(() => {
    if (isSelected) {
      handlerActiveItem(item.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isSelected]);

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }
  
  const listItemProps = item?.external
    ? { component: 'a', href: item.url, target: itemTarget }
    : { component: forwardRef((props, ref) => <Link ref={ref} {...props} to={item.url} target={itemTarget} />) };

  const Icon = item.icon;
  const itemIcon = item.icon ? <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} /> : false;

  const textColor = 'text.primary';
  const iconSelectedColor = theme.palette.success.dark; //'primary.main';

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      onClick={() => handlerActiveItem(item.id)}
      selected={isSelected}
      sx={{
        zIndex: 1201,
        pl: drawerOpen ? `${level * 28}px` : 1.5,
        py: !drawerOpen && level === 1 ? 1.25 : 1,
        ...(drawerOpen && {
          '&:hover': {
            bgcolor: 'success.lighter'
          },
          '&.Mui-selected': {
            bgcolor: 'success.lighter',
            borderRight: `2px solid ${theme.palette.success.main}`,
            color: iconSelectedColor,
            '&:hover': {
              color: iconSelectedColor,
              bgcolor: 'success.lighter'
            }
          }
        }),
        ...(!drawerOpen && {
          '&:hover': {
            bgcolor: 'transparent'
          },
          '&.Mui-selected': {
            '&:hover': {
              bgcolor: 'transparent'
            },
            bgcolor: 'transparent'
          }
        })
      }}
    >
      {itemIcon && (
        <ListItemIcon
          sx={{
            minWidth: 28,
            color: isSelected ? iconSelectedColor : textColor,
            ...(!drawerOpen && {
              borderRadius: 1.5,
              width: 36,
              height: 36,
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                bgcolor: 'secondary.lighter'
              }
            }),
            ...(!drawerOpen &&
              isSelected && {
                bgcolor: 'success.lighter',
                '&:hover': {
                  bgcolor: 'success.lighter'
                }
              })
          }}
        >
          {itemIcon}
        </ListItemIcon>
      )}
      {(drawerOpen || (!drawerOpen && level !== 1)) && (
        <ListItemText
          primary={
            <Typography variant="h6" sx={{ color: isSelected ? iconSelectedColor : textColor }}>
              {item.title}
            </Typography>
          }
        />
      )}
      {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
}

NavItem.propTypes = { item: PropTypes.object, level: PropTypes.number };
