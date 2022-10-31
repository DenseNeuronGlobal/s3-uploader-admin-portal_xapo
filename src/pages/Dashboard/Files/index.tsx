import React, {useState, useEffect} from 'react';
import { COGNITO } from "../../../configs/aws";
import AWS from "aws-sdk";
import CommonTable from "../../../components/Table";

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

    const columns = [
        {
            title: 'Name',
            key: 'Key',
        },
        {
            title: 'Last modified',
            key: 'LastModified',
            render: ((row: IFile) => row.LastModified?.toDateString()),
        },
        {
            title: 'Size',
            key: 'Size',
        },
    ];

    const fetchFolders = (prefix: string = '', newDepth: number = 0): void => {
        setLoading(true);
        setDepth(newDepth)
        const params = {
            Bucket: COGNITO.S3_BUCKET,
            StartAfter: prefix,
            Prefix: prefix
        };

        const s3 = new AWS.S3();
        s3.listObjectsV2(params, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                const contents: IFile[] = [];
                // @ts-ignore
                for (let i = 0; i < data.Contents.length ; i++) {
                    // @ts-ignore
                    const content: IFile = data.Contents[i];
                    const filePath = content.Key.split('/').filter((key) => key);
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

    useEffect(() => {
        fetchFolders()
    }, []);

    const onRowClick = (id: string): void => {
        fetchFolders(id, depth + 1);
    };

    return (
    <>
        Files List
        <CommonTable
            loading={loading}
            columns={columns}
            tableData={files}
            onRowClick={onRowClick}
        />
    </>
  );
};

export default Files;
