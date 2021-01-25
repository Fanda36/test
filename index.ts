import * as aws from "@pulumi/aws";
import {getMetadata} from "./s3";


const bucket = new aws.s3.Bucket("test");

export const bucketName = bucket.id;

bucket.onObjectCreated("onNewFile", new aws.lambda.CallbackFunction<aws.s3.BucketEvent, void>("onNewFile", {
    // Specify appropriate policies so that this AWS lambda can run EC2 tasks.
    policies: [
        aws.iam.ManagedPolicies.AWSLambdaFullAccess,                 // Provides wide access to "serverless" services (Dynamo, S3, etc.)
        aws.iam.ManagedPolicies.AmazonEC2ContainerServiceFullAccess, // Required for lambda compute to be able to run Tasks
    ],
    callback: async bucketArgs => {
        if (!bucketArgs.Records) {
            return;
        }

        for (const record of bucketArgs.Records) {
            const sourceFileKey = record.s3.object.key;

            const metadata = await getMetadata(bucketName.get(), sourceFileKey);
            console.log("metadata:", metadata);
        }
    },
}), {filterPrefix: "convert/uploads/"});
