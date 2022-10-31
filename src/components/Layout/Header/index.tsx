import React, {FC, useState} from 'react';
import {styled} from '@material-ui/core/styles';
import {Avatar, Box, Button, Divider, Popover, Typography} from '@material-ui/core';
import {Auth} from 'aws-amplify';
import {useHistory} from 'react-router-dom';
import {Toast} from '../../../utils/notifications';
import {COGNITO} from '../../../configs/aws';
import {IUser} from '../../../interfaces/user.interface';

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
  cursor: 'pointer',
}));

const UserInfoLabel: any = styled(Typography)(({ theme }) => ({
  color: 'white',
  marginLeft: theme.spacing(1),
  textTransform: 'capitalize',
}));

const MenuContent: any = styled(Box)(() => ({
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

const SignOutButton: any = styled(Button)(() => ({
  marginBottom: '16px',
  marginLeft: 'auto',
  marginRight: '12px',
  color: 'black',
  background: 'orange',
  fontSize: '12px',
  fontWeight: 'bold',
}));

const Bar: any = styled(Divider)(() => ({
  margin: '10px 0 16px',
  background: '#646b6b',
  width: '100%',
}));

interface IHeaderProps {
  user: IUser
}

const Header: FC<IHeaderProps> = ({ user }) => {
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      Toast("Success!!", "Logged out successfully!", "success");
      history.push("/signin");
    } catch (error: any) {
      if(error) {
        Toast("Error!!", error.message, "danger");
      }
    }
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
        style={{
          marginTop: '12px',
        }}
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
          <Bar />
          <SignOutButton variant="contained" onClick={handleLogout}>
            Sign out
          </SignOutButton>
        </MenuContent>
      </Popover>
    </AppHeader>
  );
}

export default Header;

