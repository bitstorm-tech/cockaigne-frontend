import AWS from "aws-sdk";

const bucket = process.env.DO_SPACES_BUCKET as string;
const baseUrl = process.env.DO_SPACES_BASE_URL;
const endpoint = process.env.DO_SPACES_ENDPOINT as string;

const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint(endpoint),
  accessKeyId: process.env.DO_SPACES_KEY,
  secretAccessKey: process.env.DO_SPACES_SECRET
});

export async function getPictureUrls(accountId: number): Promise<string[]> {
  const objects = await s3.listObjects({ Bucket: bucket, Prefix: accountId.toString() }).promise();
  return objects.Contents?.map((object) => `${baseUrl}/${object.Key}`) || [];
}

export async function savePicture(file: File, accountId: number): Promise<string> {
  const timestamp = new Date().getTime();
  const fileExtension = file.name.split(".").pop();
  const filename = `${timestamp}.${fileExtension}`;
  const key = `${accountId}/${filename}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await s3
    .putObject({
      Bucket: bucket,
      Key: key,
      ContentType: file.type,
      ACL: "public-read",
      Body: buffer
    })
    .promise();

  return `${baseUrl}/${key}`;
}
