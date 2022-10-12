import { DeleteObjectCommand, ListObjectsCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const bucket = process.env.DO_SPACES_BUCKET;
const baseUrl = process.env.DO_SPACES_BASE_URL;
const endpoint = process.env.DO_SPACES_ENDPOINT;
const region = process.env.DO_SPACES_REGION;
const key = process.env.DO_SPACES_KEY as string;
const secret = process.env.DO_SPACES_SECRET as string;

const s3 = new S3Client({
  endpoint: endpoint,
  region,
  credentials: {
    accessKeyId: key,
    secretAccessKey: secret
  }
});

export async function getPictureUrls(accountId: number): Promise<string[]> {
  const command = new ListObjectsCommand({ Bucket: bucket, Prefix: accountId.toString() });
  const response = await s3.send(command);
  return response.Contents?.map((object) => `${baseUrl}/${object.Key}`) || [];
}

export async function savePicture(file: File, accountId: number, name?: string): Promise<string> {
  const timestamp = new Date().getTime().toString();
  const fileExtension = file.name.split(".").pop();
  const filename = (name ? name : timestamp) + "." + fileExtension;
  const key = `${accountId}/${filename}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: file.type,
    ACL: "public-read",
    Body: buffer
  });

  await s3.send(command);

  return `${baseUrl}/${key}`;
}

export async function deletePicture(accountId: number, fileName: string) {
  const key = `${accountId}/${fileName}`;
  const command = new DeleteObjectCommand({ Bucket: bucket, Key: key });
  await s3.send(command);
}

export async function getProfileImageURL(accountId: number): Promise<string> {
  const prefix = `${accountId}/profile`;
  const command = new ListObjectsCommand({ Bucket: bucket, Prefix: prefix });
  const response = await s3.send(command);
  const profileImage = response.Contents?.at(0)?.Key;
  return profileImage ? `${baseUrl}/${profileImage}` : "/images/anonym-profile.png";
}
