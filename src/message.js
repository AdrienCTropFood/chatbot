/*
 * message.js
 * This file contains your bot code
 */

const recastai = require('recastai')
//var mysql = require('mysql');

// This function is the core of the bot behaviour
const replyMessage = (message) =>
{
  // Instantiate Recast.AI SDK, just for request service
  const request = new recastai.request(process.env.REQUEST_TOKEN, process.env.LANGUAGE)
  // Get text from message received
  const text = message.content

  console.log('I received : ', text)

  // Get senderId to catch unique conversation_token
  const senderId = message.senderId

  // Call Recast.AI SDK, through /converse route
  request.converseText(text, { conversationToken: senderId })
  .then(result =>
  {
    /*
    * YOUR OWN CODE
    * Here, you can add your own process.
    * Ex: You can call any external API
    * Or: Update your mongo DB
    * etc...
    */
    if (result.action)
	{
		console.log('The conversation action is: ', result.action.slug);
    }
	
	if (result == null || result.replies == null || result.replies.length <= 0)
	{
		if(result.action)
		{
			message.addReply({ type: 'text', content: 'Désolé je comprends votre question mais mes bases de données ne contiennent aucune réponse. Réessayez plus tard...' })
		}
		else
		{
			message.addReply({ type: 'text', content: 'Désolé je ne comprend pas votre question. Pourriez-vous la formuler différemment svp ?' })
		}
    }
	else
	{
		if(result.action)
		{
			if(result.action.slug == 'nutritioninformation')
			{
				//console.log('demande info nutrition');
				//console.log(result.entities);						//{ food: [ { value: 'tomate', confidence: 0.95, raw: 'tomate' } ] }
				//console.log(result.entities['food']);				//[ { value: 'tomate', confidence: 0.95, raw: 'tomate' } ]
				//console.log(result.entities['food'][0].value);	//tomate
				// get all the aliment entities extracted from your text
				console.log('entities = ');
				console.log(result.entities);
				//console.log(result.entities.toString());
				const aliments = result.entities['food'];
				var aliment = "default";
				if(aliments != null)
				{
					aliments.forEach(function(element)
					{
						aliment = element.value;
						message.addReply({ type: 'text', content: 'Vous avez demandé une information nutritionelle sur ' + aliment})
					});
				}
				
			}
			else
			{
				// Add each reply received from API to replies stack
				result.replies.forEach(replyContent => message.addReply({ type: 'text', content: replyContent }))
			}
		}
		else
		{
			message.addReply({ type: 'text', content: 'Désolé je ne comprend pas votre question. Pourriez-vous la formuler différemment svp ?' })
		}
	}

    // Send all replies
    message.reply()
    .then(() =>
	{
      // Do some code after sending messages
    })
    .catch(err =>
	{
      console.error('Error while sending message to channel', err)
    })
  })
  .catch(err =>
  {
    console.error('Error while sending message to Recast.AI', err)
  })
}

module.exports = replyMessage
