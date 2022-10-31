import React, {ReactNode} from 'react';
import {Box} from '@material-ui/core';
import {styled} from '@material-ui/core/styles';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout: any = styled(Box)({});

const Aside: any = styled(Box)(({theme}) => ({
  flex: 1,
  display: 'flex',
  height: 'calc(100vh - 60px)',

  [theme.breakpoints.down('md')]: {
    paddingLeft: 0
  }
}));

interface ILayoutProps {
  children: ReactNode;
  user: any;
}

const Layout: React.FC<ILayoutProps> = ({children, user}) => {
  return (
    <MainLayout>
      <Header user={user} />
      <Aside>
        <Sidebar />
        {children}
      </Aside>
    </MainLayout>
  );
};

export default Layout;
