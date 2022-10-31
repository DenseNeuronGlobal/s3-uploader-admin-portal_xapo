import React, {useState} from 'react';
import {styled, Theme} from "@material-ui/core/styles";
import { Box, ButtonBase, Typography, IconButton } from "@material-ui/core";
import { NavLink, useHistory} from "react-router-dom";

const Drawer: any = styled(Box)(({ theme, collapsed }: { theme: Theme, collapsed: boolean }) => ({
  width: collapsed ? '40px' : '256px',
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  boxShadow: theme.shadows[1],
  overflowX: 'hidden',
  transition: 'width 0.2s ease-in',
}));

const MenuItem: any = styled(ButtonBase)(({ theme, activated }: { theme: Theme, activated: boolean }) => ({
  backgroundColor: 'white',
  fontSize: '16px',
  margin: '12px 0',
  color: activated ? '#ec7211' : '#000',
  textDecoration: 'none'
}));

const SidebarHeader: any = styled(Box)(({ theme, collapsed }: { theme: Theme, collapsed: boolean }) => ({
  padding: collapsed ? '0' : '24px',
  borderBottom: '1px solid #eaeded',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',

  '& .MuiTypography-root': {
    fontSize: '18px',
    fontWeight: 700,
  }
}));

const MenuList: any = styled(Box)(({ theme }) => ({
  marginTop: '10px',
  padding: '0 24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
}));

const NavLinks = [
  {
    label: 'User List',
    path: '/users',
  },
  {
    label: 'File List',
    path: '/files',
  }
];

const Sidebar: React.FC = () => {
  const history = useHistory();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Drawer collapsed={collapsed}>
      <SidebarHeader collapsed={collapsed}>
        {
          !collapsed && (<Typography>Users & S3 Files Management</Typography>)
        }
        <IconButton onClick={() => setCollapsed(!collapsed)}>
          X
        </IconButton>
      </SidebarHeader>
      {
        !collapsed && (
          <MenuList>
            {
              NavLinks.map(({ label, path }, index) => (
                <MenuItem key={index} component={NavLink} to={path} activated={path === history.location.pathname}>
                  {label}
                </MenuItem>
              ))
            }
          </MenuList>
        )
      }
    </Drawer>
  );
}

export default Sidebar;
