import React, {useState, useEffect, SyntheticEvent} from 'react';
import {Box, Button, styled} from '@material-ui/core';
import {saveAs} from "file-saver";
import {COGNITO} from '../../../configs/aws';
import {Storage, Auth, API} from 'aws-amplify';
import CommonTable from '../../../components/Table';
import CommonBreadCrumb from '../../../components/BreadCrumbs';
import {IColumn, IPath, IRow} from '../../../interfaces/global.interface';
import {DeleteOutline} from "@material-ui/icons";
import SearchField from "../../../components/Search";
import {useInput} from "../../../utils/forms";
import {Toast} from "../../../utils/notifications";
import {IUserAttributes, IUserSimple, IAttribute, IUserIdentity} from "../../../interfaces/user.interface";
import {AttributeType} from "aws-sdk/clients/cognitoidentityserviceprovider";

const FileNameCell: any = styled(Box)({
  cursor: 'pointer',
  color: '#783326',
  fontSize: '14px',
  lineHeight: '22px',
  '&:hover': {
    color: '#783326',
    textDecoration: 'underline'
  }
});

const ActionWrapper: any = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '10px'
});

const RemoveButton: any = styled(Button)({
  marginBottom: '10px'
});

interface IFile {
  id: string;
  key: string;
  lastModified: Date;
  size: number;
  allowDownload?: boolean;
}

const apiName = 'AdminQueries';

const Files = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<IFile[]>([]);
  const [selectedUserIdentityId, setSelectedUserIdentityId] = useState<string>('');
  const [paths, setPaths] = useState<IPath[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const {value: search, bind: bindSearch, reset: resetSearch} = useInput('');

  const columns: IColumn[] = [
    {
      title: 'Name',
      key: 'key',
      render: (row: IRow) => (
        <FileNameCell onClick={() => onRowClick(row)}>
          {row.key}
        </FileNameCell>
      )
    },
    {
      title: 'Last modified',
      key: 'lastModified',
      render: (row: IRow) => row.lastModified ? new Date(row.lastModified).toDateString() : '-'
    },
    {
      title: 'Size',
      key: 'size'
    }
  ];

  const fetchUserIdentities = async (searchValue: string = ''): Promise<void> => {
    setLoading(true);
    const path = '/listUsers';
    try {
      const myInit = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
        }
      }
      const data = await API.get(apiName, path, myInit);
      const contents: IFile[] = [];
      for(let i = 0; i < data.Users.length ; i++) {
        const user = data.Users[i];
        if (user.Attributes) {
          const identity: IAttribute = user.Attributes.find((attribute: IAttribute) => attribute.Name === "custom:identityId");
          if (identity && identity.Value) {
            contents.push({
              id: identity.Value,
              key: user.Username,
              lastModified: user.UserLastModifiedDate,
              size: 0,
            });
          }
        }
      }
      setFiles(contents);
      setLoading(false);
    } catch (e: any) {
      console.log("error", e.message);
    }
  };

  const fetchFiles = async (identityId: string = '', searchValue: string = ''): Promise<void> => {
    setSelectedRows([]);
    setLoading(true);
    try {
      const contents = await Storage.list(searchValue, {
        pageSize: 'ALL',
        identityId
      });
      setFiles(contents.map((item: IFile) => ({
        ...item,
        allowDownload: true
      })));
    } catch (e: any) {
      console.log("error", e.message);
    }
    setLoading(false);
  };

  const downloadObject = async (identityId: string, fileName: string): Promise<void> => {
    try {
      const contents: any = await Storage.get(fileName, {
        identityId,
        download: true
      });
      const file = new Blob([contents.Body], {
        type: contents.ContentType,
      });
      saveAs(file, fileName);
    } catch (e: any) {
      console.log("error", e.message);
    }
  };

  const deleteObjects = async () => {
    for (let i = 0; i < selectedRows.length ; i++) {
      const rowId = selectedRows[i];
      await Storage.remove(rowId, {
        identityId: selectedUserIdentityId
      });
    }
    fetchFiles(selectedUserIdentityId, search);
    setSelectedRows([]);
  };

  const handleSearchChange = (e: SyntheticEvent) => {
    // @ts-ignore
    const value = e.target.value;
    if (selectedUserIdentityId) {
      fetchFiles(selectedUserIdentityId, value);
    } else {
      fetchUserIdentities(value);
    }
    bindSearch.onChange(e);
  };

  const onRowClick = (row: IRow): void => {
    const rowId = row.id as string;
    const rowKey = row.key as string;
    if (row.allowDownload) {
      downloadObject(rowId, rowKey);
      return;
    }
    resetSearch();
    setSelectedUserIdentityId(rowId);
    fetchFiles(rowId);
    setPaths(prev => [
      ...prev,
      {
        title: rowKey,
        onClick: () => {
          setPaths(prev);
          onRowClick(row);
        }
      }
    ]);
  };

  useEffect(() => {
    fetchUserIdentities();
  }, []);

  return (
    <>
      <CommonBreadCrumb
        paths={[
          {
            title: 'File List',
            onClick: () => {
              setPaths([]);
              resetSearch();
              fetchUserIdentities();
            }
          },
          ...paths
        ]}
      />
      <ActionWrapper>
        <SearchField placeholder={"Search Files"} {...bindSearch} onChange={handleSearchChange} />
        <RemoveButton color="inherit" variant="outlined" size="medium" disabled={!selectedUserIdentityId || selectedRows.length === 0} onClick={deleteObjects} className={"amplify-button--error"}>
          <DeleteOutline fontSize={"small"} />
          Delete
        </RemoveButton>
      </ActionWrapper>
      <CommonTable
        loading={loading}
        key="key"
        tableColumns={columns}
        tableData={files}
        showCheckBoxSelection
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
    </>
  );
};

export default Files;
