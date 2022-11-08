import React, {useState, useEffect, SyntheticEvent} from 'react';
import {Box, Button, styled} from '@material-ui/core';
import {saveAs} from "file-saver";
import {COGNITO} from '../../../configs/aws';
import AWS from 'aws-sdk';
import CommonTable from '../../../components/Table';
import CommonBreadCrumb from '../../../components/BreadCrumbs';
import {IColumn, IPath, IRow} from '../../../interfaces/global.interface';
import {DeleteOutline} from "@material-ui/icons";
import SearchField from "../../../components/Search";
import {useInput} from "../../../utils/forms";
import {Toast} from "../../../utils/notifications";
import {IUserAttributes, IUserSimple} from "../../../interfaces/user.interface";
import {AttributeType} from "aws-sdk/clients/cognitoidentityserviceprovider";

const FolderNameCell: any = styled(Box)({
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
  Key: string;
  LastModified: Date;
  Size: number;
  allowDownload?: boolean;
}

const Files = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userIdentities, setUserIdentities] = useState<any>({});
  const [files, setFiles] = useState<IFile[]>([]);
  const [depth, setDepth] = useState<number>(1);
  const [paths, setPaths] = useState<IPath[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const {value: search, bind: bindSearch, reset: resetSearch} = useInput('');
  const cognito = new AWS.CognitoIdentityServiceProvider();
  const s3 = new AWS.S3();

  const columns: IColumn[] = [
    {
      title: 'Name',
      key: 'Key',
      render: (row: IRow) => (
        <FolderNameCell onClick={() => onRowClick(row)}>
          {row.Key}
        </FolderNameCell>
      )
    },
    {
      title: 'Last modified',
      key: 'LastModified',
      render: (row: IRow) => (row.LastModified as Date)?.toDateString()
    },
    {
      title: 'Size',
      key: 'Size'
    }
  ];

  const fetchUserIdentities = (searchValue: string = ''): void => {
    setLoading(true);

    let params: any = {
      UserPoolId: COGNITO.USER_POOL_ID,
    };

    if (searchValue) {
      params = {
        ...params,
        Filter: `username ^= \"${searchValue}\"`
      }
    }

    cognito.listUsers(params, (err, data) => {
      if (err) {
        return;
      } else if (data.Users) {
        const identities: any = {};
        for(let i = 0; i < data.Users.length ; i++) {
          const user = data.Users[i];
          if (user.Attributes) {
            const identity = user.Attributes.find((attribute) => attribute.Name === "custom:identityId");
            if (identity && identity.Value) {
              identities[identity.Value] = user.Username;
            }
          }
        }
        setUserIdentities(identities);
        if (Object.entries(identities).length > 0) {
          fetchFolders("protected/", 1, identities);
        } else {
          setFiles([]);
          setLoading(false);
        }
      }
    });
  };

  const fetchFolders = (prefix: string = '', newDepth: number = 1, identities: any = userIdentities): void => {
    setSelectedRows([]);
    if (!loading) {
      setLoading(true);
    }
    if (depth !== newDepth) {
      setDepth(newDepth);
    }

    const params = {
      Bucket: COGNITO.S3_BUCKET,
      StartAfter: prefix,
      Prefix: prefix
    };

    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        console.log("error from fetching object", err);
      } else {
        const contents: { [key: string]: IFile } = {};
        // @ts-ignore
        for (let i = 0; i < data.Contents.length; i++) {
          // @ts-ignore
          const content: IFile = data.Contents[i];
          const filePath = content.Key.split('/').filter(key => key);
          const fileDepth = filePath.length - 1;
          const key = filePath.slice(0, newDepth + 1).join('/');
          if (newDepth === 1 && !identities[filePath[newDepth]]) {
            continue;
          }
          if (key in contents) {
            contents[key].Size += content.Size;
            continue;
          }
          contents[key] = {
            ...content,
            Key: newDepth === 1 ? identities[filePath[newDepth]] : filePath[newDepth],
            id: key,
            allowDownload: fileDepth === newDepth && !content.Key.endsWith('/')
          };
        }
        setFiles(Object.values(contents));
      }
      setLoading(false);
    });
  };

  const downloadObject = (key: string, fileName: string): void => {
    const params = {
      Bucket: COGNITO.S3_BUCKET,
      Key: key,
    };
    s3.getObject(params, (err, data) => {
      if (err) {
        console.log("error from downloading object", err);
      } else {
        // @ts-ignore
        const object = new Blob([data.Body], {
          type: data.ContentType,
        });
        saveAs(object, fileName);
      }
    });
  };

  const deleteObjects = () => {
    const params = {
      Bucket: COGNITO.S3_BUCKET,
      Delete: {
        Objects: selectedRows.map(rowId => ({
          Key: rowId
        }))
      }
    };

    s3.deleteObjects(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        fetchUserIdentities();
      }
      setLoading(false);
    });

    setSelectedRows([]);
  };

  const handleSearchChange = (e: SyntheticEvent) => {
    // @ts-ignore
    const value = e.target.value;
    if (depth === 1) {
      fetchUserIdentities(value);
    } else {
      const searchValue = paths[paths.length - 1].title;
      fetchFolders(`protected/${searchValue}/${value}`, depth);
    }
    bindSearch.onChange(e);
  };

  const onRowClick = (row: IRow, newDepth: number = depth): void => {
    if (row.allowDownload) {
      downloadObject(row.id as string, row.Key as string);
      return;
    }
    resetSearch();
    fetchFolders(row.id as string, newDepth + 1);
    setPaths(prev => [
      ...prev,
      {
        title: row.Key as string,
        onClick: () => {
          setPaths(prev);
          onRowClick(row, newDepth);
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
        <RemoveButton color="inherit" variant="outlined" size="medium" disabled={selectedRows.length === 0} onClick={deleteObjects} className={"amplify-button--error"}>
          <DeleteOutline fontSize={"small"} />
          Delete
        </RemoveButton>
      </ActionWrapper>
      <CommonTable
        loading={loading}
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
