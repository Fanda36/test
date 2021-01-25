import {Metadata} from "aws-sdk/clients/s3";

const AWS = require("aws-sdk");
const s3 = new AWS.S3();

export const getMetadata = async (bucket: string, key: string): Promise<Metadata> => {
    const fileParams = {
        Bucket: bucket,
        Key: key
    };

    let allMetaData = await s3.headObject(fileParams).promise();
    console.log(allMetaData)

    return allMetaData.Metadata;
}