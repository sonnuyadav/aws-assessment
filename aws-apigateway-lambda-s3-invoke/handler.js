const AWS = require('aws-sdk');
const S3 = new AWS.S3();

exports.handler = async (event) => {
  console.log("EVENT", event);
  const fileToUpload = {
    userId:"123456",
    city:"Delhi",
    country:"India"
  }
  try {
    const params = {
        Bucket: 'my-docx',
        Key: `upload-to-s3/${fileToUpload.userId}`,
        Body: JSON.stringify(fileToUpload),
        ContentType: 'application/json; charset=utf-8'
    }
    await S3.putObject(params).promise();
    console.log("Upload Completed");
  } catch(e){
    console.log(e)
    console.log("Upload Error", e);
  }
  
};