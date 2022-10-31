import React, { FC, useState } from 'react';
import { styled } from "@material-ui/core/styles";
import {Avatar, Box, Button, Divider, Popover, Typography} from "@material-ui/core";
import { IUser } from "../../../interfaces/user.interface";
import { COGNITO } from "../../../configs/aws";

const AppHeader: any = styled(Box)(({ theme }) => ({
  height: '60px',
  padding: '0 24px',
  backgroundColor: '#232f3e',
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

const MenuContent: any = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: '#232f3e',
  color: 'white',
}));

const InfoWrapper: any = styled(Box)(({ theme }) => ({
  padding: '12px 20px',
  color: '#AAB7B8',
}));

interface IHeaderProps {
  user: IUser
}

const Header: FC<IHeaderProps> = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppHeader>
      <Logo>
        <img src="https://docs.aws.amazon.com/assets/r/images/aws_logo_dark.png" alt="logo" />
      </Logo>
      <UserInfo onClick={handleMenuClick}>
        <Avatar />
        <UserInfoLabel>{user?.username}</UserInfoLabel>
      </UserInfo>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuContent>
          <InfoWrapper>
            <Typography variant="body2">Region: {COGNITO.REGION}</Typography>
            <Typography variant="body2">User Email: {user?.email}</Typography>
          </InfoWrapper>
          <Divider color="#f3f3f3" />
          <div>
            <Button variant="contained">Sign out</Button>
          </div>
        </MenuContent>
      </Popover>
    </AppHeader>
  );
}

export default Header;
