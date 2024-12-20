# GitHub Copilot Extension for Dust

> [!WARNING]
> This is a work in progress and not yet ready for use. Documentation and code may be incomplete or incorrect.

## Usage

Setup up your application: https://docs.github.com/en/copilot/building-copilot-extensions/setting-up-copilot-extensions

You'll need at least 2 skills, as in the screenshot below:

![Skills](./docs/skills.png)

Here is a an example of the /dust skill parameters. Don't forget to adapt the logic behind the /dust route:

```json
{
  "type": "object",
  "properties": {
    "assistant": {
      "type": "string",
      "description": "Name of the assistant to talk to."
    },
    "message": {
      "type": "string",
      "description": "The message to send to Dust",
      "required": "true"
    }
  }
}
```

Copy and adjust the `.env` file:

```sh
cp .env .env.local
```

Run the server:

```sh
pnpm run dev
```

Optionally expose the server to the internet using ngrok to test it live from GitHub Copilot:

```sh
ngrok http 3000
```

## Deployment

TBD
