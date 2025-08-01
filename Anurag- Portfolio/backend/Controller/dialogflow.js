const dialogflow = require('dialogflow');
require('dotenv').config();

const sessionClient = new dialogflow.SessionsClient({
  credentials: {
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL
  }
});

const sessionPath = sessionClient.sessionPath(process.env.GOOGLE_PROJECT_ID, 'unique-session-id');



const sendMessageToDialogflow = async (req, res) => {
  try {
    const { message } = req.body;

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'en-US',
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    res.json({ reply: result.fulfillmentText }); 
  } catch (error) {
    console.error('Dialogflow Error:', error.message);
    res.status(500).json({ error: 'Failed to process message.' });
  }
};



module.exports = { sendMessageToDialogflow };
