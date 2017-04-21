var RtmClient = require('@slack/client').RtmClient;
var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var Conversation = require('watson-developer-cloud/conversation/v1')
var conversation = new ConversationV1({
  username: process.env.CONVERSATION_USERNAME || '',
  password: process.env.CONVERSATION_PASSWORD || '',
  version_date: ConversationV1.VERSION_DATE_2017_02_03
});
var workspace_id = process.env.CONVERSATION_WORKSPACE_ID || ''
var bot_token = process.env.SLACK_BOT_TOKEN || '';

var rtm = new RtmClient(bot_token);
rtm.start();

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
  conversation.message({
    input: {text: 'Hello'},
    workspace_id: workspace_id
  }, function(err, response) {
    if (err) {
      console.log(err)
    }
    else {
      console.log(JSON.stringify(response))
    }
  })
  console.log(message)
  rtm.sendMessage("Hello <@" + message.user + ">!", message.channel);
});

rtm.start();