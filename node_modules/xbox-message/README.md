# xbox-message
[![NPM version](https://img.shields.io/npm/v/xbox-message.svg)](http://npmjs.com/package/xbox-message)
[![Discord](https://img.shields.io/badge/chat-on%20discord-brightgreen.svg)](https://discord.gg/KTyd9HWuBD)

A library for interacting with the Xbox Message service. Creates a connection to the Xbox Message service and allows you to send and receive messages in real-time.

# Installation
```shell
npm install xbox-message
```

# Usage

## XboxMessage()
**Parameters**
- options (optional) - An object containing the following options
  - cacheIdentifier (optional) - Used to identify the credential cache, change this to sign into a different account
  - cachePath (optional) - The path to the credential cache, defaults to the current working directory
  - authflow (optional) - Takes an **Authflow** instance from [prismarine-auth](https://github.com/PrismarineJS/prismarine-auth), you can see the documentation for this [here.](https://github.com/PrismarineJS/prismarine-auth#authflow)
    - Overrides the `cacheIdentifier` and `cachePath` options.

```js
const { XboxMessage } = require('xbox-message');

const client = new XboxMessage();
```

### Events

A list of events that can be emitted by the XboxMessage class can be found below.

- 'message' - emitted when a message is received
- 'messageDelete' - emitted when a message is deleted
- 'event' - emitted when an event has been received from a subscribed resource

```js
client.on('message', (message) => {
	console.log(message);
});

client.on('messageDelete', (message) => {
	console.log(message);
});

client.on('event', (data) => {
	console.log(data);
});
```

### Methods

A list of methods that can be called on the XboxRTA class can be found below.

#### #.connect()
Connects to the Xbox messaging service.

```js
await client.connect();
```

#### #.destroy()
Destroys the connection to the Xbox messaging service.

```js
await client.destroy();
```

Full code

```js
const { XboxMessage } = require('xbox-message');

const main = async () => {

	const client = new XboxMessage();

	client.on('message', (message) => {
		console.log(data);
	});

	client.on('messageDelete', (message) => {
		console.log(data);
	});

	client.on('event', (data) => {
		console.log(data);
	});

	await client.connect();

	setTimeout(async () => {
		await client.destroy();
	}, 120000); // Destroy the connection after 2 minutes

};

main();
```

## Example

[View more examples](https://github.com/LucienHH/xbox-message/tree/main/examples)

## Debugging

You can enable some debugging output using the `DEBUG` enviroment variable. Through node.js, you can add `process.env.DEBUG = 'xbox-message'` at the top of your code.

## License

[MIT](LICENSE)
