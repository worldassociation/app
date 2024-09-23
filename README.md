# World Association App

The World Association app is an open-source platform designed to facilitate global cooperation and democratic processes by empowering individuals and promoting transparency in global decision-making. It serves as the primary online resource for the World Association community, enabling people to join the World Association, set up their basic income, and engage with the community.

## Philosophy

The app is built on the principle of individual freedom and the right to fork. We believe that all core software and tooling required to run the Association should be freely available and easy to use. This ensures that if the governance of the World Association is ever compromised, members can fork the system and reinstate a new Association that better serves humanity.

## Technology Stack

- Framework: [Next.js (App Router)](https://nextjs.org)
- Language: [TypeScript](https://typescriptlang.org)
- Styling: [Tailwind CSS](https://tailwindcss.com)
- Components: [Shadcn UI](https://ui.shadcn.com)
- Onchain components: [OnchainKit](https://onchainkit.xyz/)
- Backend: [Base](https://base.org) and [thirdweb Engine](https://thirdweb.com/engine)
- Auth: [zkMe](https://zk.me) and [Coinbase Verifications](https://www.coinbase.com/onchain-verify)
- Money streaming: [Superfluid](https://superfluid.finance)
- Access: [Guild](https://guild.xyz/)
- Deployment: [Vercel](https://vercel.com)

## Getting Started

### Environment Setup

1. Copy the `.env.example` file and rename it to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file and replace the placeholder values with your actual API keys and configurations:
   - OnchainKit: Get this from https://portal.cdp.coinbase.com/products/onchainkit
   - zKMe: Obtain from https://dashboard.zk.me/
   - thirdweb Engine: Set up at https://thirdweb.com/dashboard/engine or deploy your own following [this guide](https://support.thirdweb.com/engine/eRgkLPBdL1WJJLzAbuWrPZ/how-to-deploy-your-self-hosted-thirdweb-engine-on-the-railway/d97FnFt8e926FqniTaYxfD)
   - Worldcoin: Get these from https://developer.worldcoin.org
3. Make sure not to commit your actual `.env` file to version control.

### Running the Development Server

To run the development server:

```bash
pnpm install
pnpm dev
```

The application will be available at http://localhost:3000.

## Contributing

We welcome contributions from the community. Please read our [Contributing Guidelines](CONTRIBUTING.md) for more information on how to get involved.

## License

This project is open-source and available under the [MIT License](LICENSE).
