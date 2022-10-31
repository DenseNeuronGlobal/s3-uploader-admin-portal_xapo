import React, {useState} from 'react';
import {styled, Theme} from '@material-ui/core/styles';
import {Box, ButtonBase, Typography, IconButton} from '@material-ui/core';
import {NavLink, useHistory} from 'react-router-dom';
import {Auth} from 'aws-amplify';
import {Toast} from '../../../utils/notifications';

const Drawer: any = styled(Box)(({theme, collapsed}: {theme: Theme; collapsed: boolean}) => ({
  width: collapsed ? '40px' : '256px',
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  boxShadow: theme.shadows[1],
  overflowX: 'hidden',
  transition: 'width 0.2s ease-in'
}));

const MenuItem: any = styled(ButtonBase)(({theme, activated}: {theme: Theme; activated: boolean}) => ({
  backgroundColor: 'white',
  fontSize: '16px',
  margin: '12px 0',
  color: activated ? '#ec7211' : '#000',
  textDecoration: 'none'
}));

const SidebarHeader: any = styled(Box)(({theme, collapsed}: {theme: Theme; collapsed: boolean}) => ({
  padding: collapsed ? '4px' : '24px',
  borderBottom: '1px solid #eaeded',
  display: 'flex',
  justifyContent: collapsed ? 'center' : 'space-between',
  alignItems: 'flex-start',
  width: collapsed ? '32px' : 'auto',

  '& .MuiTypography-root': {
    fontSize: '18px',
    fontWeight: 700
  },

  '& .MuiButtonBase-root': {
    padding: '5px',
    '& img': {
      width: collapsed ? '16px' : '20px'
    }
  }
}));

const MenuList: any = styled(Box)(({theme}) => ({
  marginTop: '10px',
  padding: '0 24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start'
}));

const NavLinks = [
  {
    label: 'User List',
    path: '/users'
  },
  {
    label: 'File List',
    path: '/files'
  }
];

const LogoutButton: any = styled(ButtonBase)(({theme, activated}: {theme: Theme; activated: boolean}) => ({
  margin: '12px 0',
  marginTop: 'auto',
  backgroundColor: 'white',
  fontSize: '16px',
  color: activated ? '#ec7211' : '#000',
  textDecoration: 'none'
}));

const Sidebar: React.FC = () => {
  const history = useHistory();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      Toast('Success!!', 'Logged out successfully!', 'success');
      history.push('/signin');
    } catch (error: any) {
      if (error) {
        Toast('Error!!', error.message, 'danger');
      }
    }
  };

  return (
    <Drawer collapsed={collapsed}>
      <SidebarHeader collapsed={collapsed}>
        {!collapsed && <Typography>Users & S3 Files Management</Typography>}
        <IconButton onClick={() => setCollapsed(!collapsed)}>
          <img src={collapsed ? `icons/bars.svg` : `icons/close.svg`} alt="icon" />
        </IconButton>
      </SidebarHeader>
      {!collapsed && (
        <MenuList>
          {NavLinks.map(({label, path}, index) => (
            <MenuItem key={index} component={NavLink} to={path} activated={path === history.location.pathname}>
              {label}
            </MenuItem>
          ))}
        </MenuList>
      )}
    </Drawer>
  );
};

export default Sidebar;
