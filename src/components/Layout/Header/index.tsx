import React from 'react';
import { styled } from "@material-ui/core/styles";
import { Avatar, Box, Typography } from "@material-ui/core";

const AppHeader: any = styled(Box)(({ theme }) => ({
  height: '60px',
  padding: '0 24px',
  backgroundColor: '#16191f',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const Logo: any = styled(Box)(({ theme }) => ({
}));

const UserInfo: any = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: 'white',
}));

const UserInfoLabel: any = styled(Typography)(({ theme }) => ({
  color: 'white',
  marginLeft: theme.spacing(1),
  textTransform: 'capitalize',
}));

const Header: React.FC<{ user: any }> = ({ user }) => {
  return (
    <AppHeader>
      <Logo>
        <img src="https://docs.aws.amazon.com/assets/r/images/aws_logo_dark.png" alt="logo" />
      </Logo>

      <UserInfo>
        <Avatar />
        <UserInfoLabel>{user?.username}</UserInfoLabel>
      </UserInfo>
    </AppHeader>
  );
}

export default Header;
