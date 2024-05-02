const xlsx = require('xlsx');
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const ses = new aws.SES({region: 'us-east-2'});


exports.handler = async (event) => {
    const bucketName = 'excel-files';
    const fileKey = event.fileName;
    // Simple GetObject
    let file = await s3.getObject({Bucket: bucketName, Key: fileKey}).promise();
    let readFile = xlsx.readFile(file)
    let sheetName = readFile.SheetNames[0];
    const getData = xlsx.utils.sheet_to_json(readFile.Sheets[sheetName]);
    sendMail("Sent email from lambda", "Test Body", getData.email);

    const response = {
        statusCode: 200
    };
    return response;
};


async function sendMail(subject, data, userEmail) {
    const emailParams = {
          Destination: {
            ToAddresses: [userEmail],
          },
          Message: {
            Body: {
              Text: { Data: data },
            },
            Subject: { Data: subject },
          },
          Source: "sonnuyadav@gmail.com",
    };
        
    try {
          let key = await ses.sendEmail(emailParams).promise();
          console.log("MAIL SENT SUCCESSFULLY!!");      
    } catch (e) {
          console.log("FAILURE IN SENDING MAIL!!", e);
        }  
    return;
  }