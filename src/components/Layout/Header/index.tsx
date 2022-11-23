import React, {FC, useState} from 'react';
import {styled} from '@material-ui/core/styles';
import {Avatar, Box, Popover, Typography} from '@material-ui/core';
import {Auth} from 'aws-amplify';
import {useHistory} from 'react-router-dom';
import {Toast} from '../../../utils/notifications';
import {IUser} from '../../../interfaces/user.interface';

const AppHeader: any = styled(Box)(({ theme }) => ({
  height: '60px',
  padding: '0 24px',
  backgroundColor: '#783326',
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
  background: '#783326',
  width: '300px'
}));

const DropdownOption: any = styled(Box)({
  width: '-webkit-fill-available',
  lineHeight: '22px',
  padding: '9px 20px',
  fontSize: '14px',
  color: '#ffffff',
  border: '1px solid #414750',
  borderRadius: 0
});

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
        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIxIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjIxIDIwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfMTQzNF83MzExKSI+CjxwYXRoIGQ9Ik0xMS43NjE4IDMuNzA0MUg5Ljc3Mzk4TDUuOTUwMTUgOC42MzI1M0wyLjIxNTY3IDMuNzA0MUgwLjE3NDIxNkw0Ljg5NTkyIDkuODYxMzRMMCAxNi4xNzI3SDEuOTgzMzhMNS45NDU2OSAxMS4wODU3TDkuODkwMTIgMTYuMTcyN0gxMS45MzZMNi45OTU0NSA5Ljg2MTM0TDExLjc2MTggMy43MDQxWiIgZmlsbD0iI0VCRUJFOSIvPgo8cGF0aCBkPSJNMzEuNDM4OSAxMi4zNTM4SDI1LjIyOTZMMjcuNDQ1MyA3LjcyOTI1QzI3Ljc0NDYgNy4xMDgyNCAyOC4wNjE4IDYuMzY4MzEgMjguMjQ5NCA1LjkyMzQ4QzI4LjI4MDcgNS44NDg2IDI4LjMxMTkgNS43NzgxMyAyOC4zMzQzIDUuNzIwODhDMjguMzY1NSA1Ljc5MTM1IDI4LjQwMTMgNS44Nzk0MyAyOC40NDU5IDUuOTgwNzNDMjguNjQyNSA2LjQ0MzE5IDI4Ljk0NjMgNy4xNDM0NyAyOS4yMjMyIDcuNzI5MjVMMzEuNDM4OSAxMi4zNTgyVjEyLjM1MzhaTTI5LjA4OTIgMy42NjQwNkgyNy41NzQ5TDIxLjY0MjYgMTYuMTcyM0gyMy40NDI4TDI0LjU5NTMgMTMuNzg1MkgzMi4wOTExTDMzLjI0MzYgMTYuMTcyM0gzNS4wMjE1TDI5LjExNiAzLjcyNTcyTDI5LjA4OTIgMy42Njg0N1YzLjY2NDA2WiIgZmlsbD0iI0VCRUJFOSIvPgo8cGF0aCBkPSJNNTQuOTA1NiA4LjQwMzUxQzU0LjkwNTYgMTAuMjQ0NSA1My40MzYgMTEuNTc5IDUxLjQxNjggMTEuNTc5SDQ3LjgxMTlWNS4yMjhINTEuNDM0N0M1My40NDQ5IDUuMjI4IDU0LjkwNTYgNi41NjI1IDU0LjkwNTYgOC40MDM1MVpNNTEuMjgyOCAzLjcwNDFINDYuMDc0MlYxNi4xNzI3SDQ3LjgxMTlWMTMuMTA3M0g1MS4yNjA1QzU0LjUxMjUgMTMuMTA3MyA1Ni43MDE0IDExLjIxNzkgNTYuNzAxNCA4LjQwNzkxQzU2LjcwMTQgNS41OTc5NiA1NC41MjE1IDMuNzA4NTEgNTEuMjgyOCAzLjcwODUxIiBmaWxsPSIjRUJFQkU5Ii8+CjxwYXRoIGQ9Ik03My4zODY0IDE0Ljc3NkM3MC42OTcyIDE0Ljc3NiA2OC41OTMyIDEyLjY0ODcgNjguNTkzMiA5LjkzNTY2QzY4LjU5MzIgNy4yMjI2IDcwLjcwMTcgNS4wOTUzMiA3My4zODY0IDUuMDk1MzJDNzYuMDcxMSA1LjA5NTMyIDc4LjE2MTcgNy4yMjI2IDc4LjE2MTcgOS45MzU2NkM3OC4xNjE3IDEyLjY0ODcgNzYuMDYyMiAxNC43NzYgNzMuMzg2NCAxNC43NzZaTTczLjM4NjQgMy41MDk3N0M2OS42ODc2IDMuNTA5NzcgNjYuNzkzIDYuMzMyOTMgNjYuNzkzIDkuOTMxMjZDNjYuNzkzIDEzLjUyOTYgNjkuNjg3NiAxNi4zNTI4IDczLjM4NjQgMTYuMzUyOEM3Ny4wODUxIDE2LjM1MjggNzkuOTU3NSAxMy41Mjk2IDc5Ljk1NzUgOS45MzEyNkM3OS45NTc1IDYuMzMyOTMgNzcuMDcxNyAzLjUwOTc3IDczLjM4NjQgMy41MDk3N1oiIGZpbGw9IiNFQkVCRTkiLz4KPHBhdGggZD0iTTE0Mi45NjggOS45NjI2NEgxNDcuNEMxNDkuMDE3IDkuOTYyNjQgMTUwLjEwMiAxMC45MDk2IDE1MC4xMDIgMTIuMzIzM0MxNTAuMTAyIDEzLjczNzEgMTQ4Ljk3NiAxNC42NDQ0IDE0Ny4wMTUgMTQuNjQ0NEgxNDIuOTY4VjkuOTYyNjRaTTE0Ny4xODUgOC40NTYzNkgxNDIuOTY4VjUuMjI4SDE0Ni45MzlDMTQ4LjE2OCA1LjIyOCAxNDguODc0IDUuODE4MTcgMTQ4Ljg3NCA2Ljg0ODc4QzE0OC44NzQgNy44MjIxNCAxNDguMjEzIDguNDUxOTYgMTQ3LjE5IDguNDUxOTZMMTQ3LjE4NSA4LjQ1NjM2Wk0xNDkuNDY4IDguOTc2MDdDMTUwLjE5NiA4LjU0MDA0IDE1MC42ODcgNy42NTQ3NyAxNTAuNjg3IDYuNzM4NjhDMTUwLjY4NyA0LjgzNjAxIDE0OS4zMiAzLjcwNDEgMTQ3LjAzMyAzLjcwNDFIMTQxLjIzVjE2LjE3MjdIMTQ3LjExNEMxNTAuMDggMTYuMTcyNyAxNTEuOTIgMTQuNjkyOSAxNTEuOTIgMTIuMzA1N0MxNTEuOTIgMTAuNTYxNiAxNTAuNzI3IDkuMzUwNDQgMTQ5LjQ3MiA4Ljk4MDQ3IiBmaWxsPSIjRUJFQkU5Ii8+CjxwYXRoIGQ9Ik0xNzIuMjIgMTIuMzUzOEgxNjYuMDExTDE2OC4yMjcgNy43MjkyNUMxNjguNTI2IDcuMTA4MjQgMTY4Ljg0MyA2LjM2ODMxIDE2OS4wMjYgNS45MjM0OEMxNjkuMDU3IDUuODQ4NiAxNjkuMDg5IDUuNzc4MTMgMTY5LjExMSA1LjcyMDg4QzE2OS4xNDIgNS43OTEzNSAxNjkuMTc4IDUuODc5NDMgMTY5LjIyMyA1Ljk4MDczQzE2OS40MTkgNi40NDMxOSAxNjkuNzIzIDcuMTQzNDcgMTcwIDcuNzI5MjVMMTcyLjIxNiAxMi4zNTgyTDE3Mi4yMiAxMi4zNTM4Wk0xNjkuODcgMy42NjQwNkgxNjguMzU2TDE2Mi40MjQgMTYuMTcyM0gxNjQuMjI0TDE2NS4zNzcgMTMuNzg1MkgxNzIuODcyTDE3NC4wMjUgMTYuMTcyM0gxNzUuODAzTDE2OS44OTcgMy43MjU3MkwxNjkuODcgMy42Njg0N1YzLjY2NDA2WiIgZmlsbD0iI0VCRUJFOSIvPgo8cGF0aCBkPSJNMTk1LjkxNyAxMy40MDE5QzE5NS42NjcgMTIuOTk2NyAxOTUuMjA3IDEyLjI3ODggMTk0Ljc3NCAxMS43MTA3TDE4OC41NzMgMy43Mzg4NkwxODguNTQyIDMuNjk5MjJIMTg2Ljg1NFYxNi4xNjc4SDE4OC41OTFWNi41NDQ0MUMxODguODQxIDYuOTU4NDEgMTg5LjMwNiA3LjcwMjc0IDE4OS44MTEgOC4zNTAxOEwxOTUuODk5IDE2LjEzMjZMMTk1LjkzMSAxNi4xNzIySDE5Ny42NTVWMy43MDM2MkgxOTUuOTEzVjEzLjQwMTlIMTk1LjkxN1oiIGZpbGw9IiNFQkVCRTkiLz4KPHBhdGggZD0iTTIxNS41NDYgOS40NjQ0N0wyMjAuNjA3IDMuNjk5MjJIMjE4LjQ5NEwyMTIuNTQ4IDEwLjI4MzdDMjEyLjI1OCAxMC41OTY0IDIxMS45MTQgMTEuMDU0NCAyMTEuNzA4IDExLjM0NTFWMy43MDM2MkgyMDkuOTcxVjE2LjE3MjJIMjExLjcwOFYxMy42NzA2TDIxNC40NDIgMTAuNjYyNEwyMTguODc4IDE2LjEzN0wyMTguOTA5IDE2LjE3NjZIMjIwLjk5NUwyMTUuNTQxIDkuNDczMjhMMjE1LjU0NiA5LjQ2NDQ3WiIgZmlsbD0iI0VCRUJFOSIvPgo8cGF0aCBkPSJNMTAyLjk5MyAxMC4wMDIyTDExMC42MjcgMTcuNTI5MkwxMTguMjYxIDEwLjAwMjJMMTEwLjYyNyAyLjQ3NTIzTDEwMi45OTMgMTAuMDAyMlpNMTEwLjYyNyAyMC4wMDQ0TDEwMC40ODIgMTAuMDAyMkwxMTAuNjI3IDBMMTIwLjc3MiAxMC4wMDIyTDExMC42MjcgMjAuMDA0NFoiIGZpbGw9IiNFQkVCRTkiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8xNDM0XzczMTEiPgo8cmVjdCB3aWR0aD0iMjIxIiBoZWlnaHQ9IjIwIiBmaWxsPSJ3aGl0ZSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=" alt="logo" />
      </Logo>
      <UserInfo onClick={handleMenuClick}>
        <Avatar />
        <UserInfoLabel>{user?.email}</UserInfoLabel>
      </UserInfo>
      <Popover
        style={{
          marginTop: '10px'
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
          <DropdownOption onClick={handleLogout}>
            Sign out
          </DropdownOption>
        </MenuContent>
      </Popover>
    </AppHeader>
  );
}

export default Header;

