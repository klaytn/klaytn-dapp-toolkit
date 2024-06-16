import React from "react";

export default function Basic() {
  return (
    <div>
      <header>
        <h2>3-Frontend Basics</h2>
      </header>
      <div id="basic-3-1" className="subSection">
        <div className="subSection_content">
          <h4>NextJS App Router (Typescript) + TailwindCSS + Shadcn UI</h4>
          <hr />
          <p>
            Next.js Pages/App Router is a full-stack React framework. The
            framework is flexible and helps you build large or small React
            applications. To start creating a new Next.js project, run the
            following command in the terminal:
          </p>
          <pre>
            <code>
              {`npx create-next-app@latest my-app --typescript --tailwind --eslint`}
            </code>
          </pre>
          <p>You will see the following prompts in the terminal:</p>
          <pre>
            <code>{`What is your project named? my-app
Would you like to use TypeScript? No / Yes
Would you like to use ESLint? No / Yes
Would you like to use Tailwind CSS? No / Yes
Would you like to use \`src/\` directory? No / Yes
Would you like to use App Router? (recommended) No / Yes
Would you like to customize the default import alias (@/*)? No / Yes
What import alias would you like configured? @/*`}</code>
          </pre>
          <p>For each prompt, you will choose the following options:</p>
          <pre>
            <code>{`What is your project named? my-app
Would you like to use TypeScript? Yes # Typescript is currently the top choice
Would you like to use ESLint? Yes # ESLint to lint your code
Would you like to use Tailwind CSS? Yes # Tailwind CSS for writing interfaces quickly
Would you like to use \`src/\` directory? No # Do not use src directory because it is not necessary
Would you like to use App Router? (recommended) Yes # Use App router to take advantage of the latest nextjs features
Would you like to customize the default import alias (@/*)? No # No, use default`}</code>
          </pre>
          <p>
            Visit Next.JS Docs here if you have problems:
            <a href="https://nextjs.org/docs">https://nextjs.org/docs</a>
          </p>
          <p>
            <span className="highlight">cd</span>into your directory (
            <span className="highlight">my-app</span> or whichever name you
            chose) and run the following command to install Schadcn UI
          </p>
          <pre>
            <code>{`npx shadcn-ui@latest init`}</code>
          </pre>
          <p>
            You will see the following prompts to set up
            <span className="highlight">components.json</span>:
          </p>
          <pre>
            <code>
              {`Which style would you like to use? › Default
Which color would you like to use as base color? › Slate
Do you want to use CSS variables for colors? › no / yes`}
            </code>
          </pre>
          <p>
            You can choose according to your preferences, but for this bootcamp
            you will choose:
          </p>
          <pre>
            <code>
              {`Which style would you like to use? › Default
Which color would you like to use as base color? › Slate
Do you want to use CSS variables for colors? › yes`}
            </code>
          </pre>
          <p>
            Learn more with ShadcnUI's tutorial:
            <a href="https://ui.shadcn.com/docs/installation/next">
              https://ui.shadcn.com/docs/installation/next
            </a>
          </p>
          <p>
            A special feature of Shadcn UI is that the library will create a{" "}
            <span className="highlight">components</span> folder directly in the
            project as below:
          </p>
          <pre>
            <code>{`.
└── components
    ├── ui
    │   ├── button.tsx
    │   ├── input.tsx
    │   ├── card.tsx
    │   └── form.tsx  
    └── authentication-menu.tsx`}</code>
          </pre>
          <p>
            You will use the components in the{" "}
            <span className="highlight">ui</span> folder to build your own{" "}
            <span className="highlight">custom components.</span> For example
            above, you use 4 components{" "}
            <span className="highlight">button.tsx</span>,{" "}
            <span className="highlight">input.tsx</span>,{" "}
            <span className="highlight">card.tsx</span> and{" "}
            <span className="highlight">form.tsx</span> to create a custom
            component <span className="highlight">authentication-menu.tsx</span>
            .
          </p>
        </div>
        <div className="subSection_content">
          <h4>Create project on WalletConnect</h4>
          <hr />
          <p>
            Visit{" "}
            <a href="https://cloud.walletconnect.com/sign-in">
              https://cloud.walletconnect.com/sign-in
            </a>
            .
          </p>
          <p>
            Create an account and follow the instructions on the Dashboard to
            set up a Project ID.
          </p>
          <p>
            WalletConnect will use your Project ID to track connection requests.
          </p>
        </div>
        <div className="subSection_content">
          <h4>Wagmi + Rainbowkit + Tanstack React Query</h4>
          <hr />
          <p>
            Wagmi is a React Hook library for building interfaces more quickly.
            In particular, Wagmi also provides convenient React Hooks to be able
            to manage the entire lifecycle of a transaction, basically from
            connecting the wallet, to initiating the transaction, to waiting for
            results from the node to return and process. error handling or
            successful transaction status. Managing the entire lifecycle of a
            transaction well will help increase user experience, helping them
            understand their own activities.
          </p>
          <p>You will install the wagmi library in common with Rainbowkit</p>
          <pre>
            <code>
              {`npm install @rainbow-me/rainbowkit wagmi viem@2.x @tanstack/react-query`}
            </code>
          </pre>
          <p>Next, you create the providers.tsx file in the app directory</p>
          <pre>
            <code>
              {`'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import {
  klaytn, // import klaytn mainnet
  klaytnBaobab, // import klaytn testnet
} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, http } from 'wagmi';
// import according to docs

const { wallets } = getDefaultWallets();
// initialize and destructure wallets object

const config = getDefaultConfig({
  appName: 'MY_APP', // Name your app
  projectId: "WALLETCONNECT_PROJECT_ID", // Enter your WalletConnect Project ID here
  wallets: [
    ...wallets,
    {
      groupName: 'Other',
      wallets: [trustWallet, ledgerWallet],
    },
  ],
  chains: [
    klaytn,
    klaytnBaobab
  ],
  transports: {
    [klaytn.id]: http('https://rpc.ankr.com/klaytn'), // Select RPC provider Ankr instead of the default
    [klaytnBaobab.id]: http('https://rpc.ankr.com/klaytn_testnet'), // Select RPC provider Ankr instead of the default
  },
  ssr: true, // Because it is Nextjs's App router, you need to declare ssr as true
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}`}
            </code>
          </pre>
          <p>Next, add this code to the next.config.mjs file:</p>
          <pre>
            <code>
              {`/** @type {import('next').NextConfig} */
const nextConfig = {
  ...
  reactStrictMode: true,
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

export default nextConfig;`}
            </code>
          </pre>
          <p>
            Next, wrap <span className="highlight">{`<Providers>`}</span> around{" "}
            <span className="highlight">children</span> in your
            <span className="highlight">layout.tsx</span> file to this:
          </p>
          <pre>
            <code>
              {`import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Klaytn DApp Bootcamp Frontends",
  description: "Interactive frontend for Klaytn DApp bootcamp contracts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}`}
            </code>
          </pre>
          <p>
            You can then import{" "}
            <span className="highlight">{`<ConnectButton />`}</span> into your
            app
          </p>
          <pre>
            <code>
              {`import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {

  return (
    <div className="flex flex-col gap-8 items-center justify-center py-12 px-4 p-48:lg">
      <ConnectButton />
    </div>
  );
}`}
            </code>
          </pre>
          <p>
            Visit Rainbowkit docs to learn more about settings:
            <a href="https://www.rainbowkit.com/docs/installation">
              https://www.rainbowkit.com/docs/installation
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
