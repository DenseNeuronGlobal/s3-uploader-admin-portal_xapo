import React from 'react';
import {styled, Theme} from "@material-ui/core/styles";
import {Box, ButtonBase, Typography} from "@material-ui/core";
import {NavLink, useHistory} from "react-router-dom";

const Drawer: any = styled(Box)(({ theme }) => ({
  width: '256px',
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '36px 20px',
  boxShadow: theme.shadows[1]
}));

const MenuItem: any = styled(ButtonBase)(({ theme, activated }: { theme: Theme, activated: boolean }) => ({
  backgroundColor: 'white',
  fontSize: '20px',
  padding: '10px 0',
  width: '100%',
  color: activated ? theme.palette.primary.main : '#000',
  textDecoration: 'none'
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

  return (
    <Drawer>
      {
        NavLinks.map(({ label, path }, index) => (
          <MenuItem component={NavLink} to={path} activated={path === history.location.pathname}>
            {label}
          </MenuItem>
        ))
      }
    </Drawer>
  );
}

export default Sidebar;
