import React, {useState, useEffect} from 'react';
import {Button} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {COGNITO} from '../../../configs/aws';
import AWS from 'aws-sdk';
import CommonTable from '../../../components/Table';
import CommonBreadCrumb from '../../../components/BreadCrumbs';
import {IColumn, IPath} from '../../../interfaces/global.interface';

const useStyles = makeStyles(() =>
  createStyles({
    folderName: {
      cursor: 'pointer',
      color: '#0073bb',
      fontSize: '14px',
      lineHeight: '22px',
      '&:hover': {
        color: '#0073bb',
        textDecoration: 'underline'
      }
    },
    deleteButton: {
      color: '#d32f2f',
      marginLeft: 'auto',
      marginBottom: '10px'
    }
  })
);

interface IFile {
  id: string;
  Key: string;
  LastModified: Date;
  Size: number;
}

const Files = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<IFile[]>([]);
  const [depth, setDepth] = useState<number>(0);
  const [paths, setPaths] = useState<IPath[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const classes = useStyles();
  const s3 = new AWS.S3();
  const columns: IColumn[] = [
    {
      title: 'Name',
      key: 'Key',
      render: (row: IFile) => (
        <span onClick={() => onRowClick(row)} className={classes.folderName}>
          {row.Key}
        </span>
      )
    },
    {
      title: 'Last modified',
      key: 'LastModified',
      render: (row: IFile) => row.LastModified?.toDateString()
    },
    {
      title: 'Size',
      key: 'Size'
    }
  ];

  const fetchFolders = (prefix: string = '', newDepth: number = 0): void => {
    setSelectedRows([]);
    setLoading(true);
    setDepth(newDepth);

    const params = {
      Bucket: COGNITO.S3_BUCKET,
      StartAfter: prefix,
      Prefix: prefix
    };

    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log('data', data);
        const contents: IFile[] = [];
        // @ts-ignore
        for (let i = 0; i < data.Contents.length; i++) {
          // @ts-ignore
          const content: IFile = data.Contents[i];
          const filePath = content.Key.split('/').filter(key => key);
          const fileDepth = filePath.length - 1;
          if (newDepth === fileDepth) {
            contents.push({
              ...content,
              Key: filePath[newDepth],
              id: content.Key
            });
          }
        }
        setFiles(contents);
      }
      setLoading(false);
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
        fetchFolders();
      }
      setLoading(false);
    });

    setSelectedRows([]);
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const onRowClick = (row: IFile, newDepth: number = depth): void => {
    fetchFolders(row.id, newDepth + 1);
    setPaths(prev => [
      ...prev,
      {
        title: row.Key,
        onClick: () => {
          setPaths(prev);
          onRowClick(row, newDepth);
        }
      }
    ]);
  };

  return (
    <>
      <CommonBreadCrumb
        paths={[
          {
            title: 'File List',
            onClick: () => {
              setPaths([]);
              fetchFolders();
            }
          },
          ...paths
        ]}
      />
      <Button color="inherit" variant="outlined" disabled={selectedRows.length === 0} onClick={deleteObjects} className={classes.deleteButton}>
        Delete
      </Button>
      <CommonTable
        loading={loading}
        columns={columns}
        tableData={files}
        showCheckBoxSelection
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
    </>
  );
};

export default Files;
