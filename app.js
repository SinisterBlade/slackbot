var RtmClient = require('@slack/client').RtmClient;
var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var Conversation = require('watson-developer-cloud/conversation/v1')
var conversation = new Conversation({
  username: process.env.CONVERSATION_USERNAME || '',
  password: process.env.CONVERSATION_PASSWORD || '',
  version_date: Conversation.VERSION_DATE_2017_02_03
});
var workspace_id = process.env.CONVERSATION_WORKSPACE_ID || ''
var bot_token = process.env.SLACK_BOT_TOKEN || '';

var rtm = new RtmClient(bot_token);
rtm.start();

var responseObj = {
  context: {}
}
rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
  responseObj.context.user = message.user
  conversation.message({
    input: {text: message.text},
    context: responseObj.context,
    workspace_id: workspace_id
  }, function(err, response) {
    if (err) {
      console.log(err)
    }
    else {
      console.log(JSON.stringify(response, null, 2))
      responseObj = response
      rtm.sendMessage(response.output.text[0], message.channel);
    }
  })
});

rtm.start();