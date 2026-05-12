export interface BlogPost {
  title: string;
  slug: string;
  description: string;
  metaDescription: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  readingTime: string;
  content: string;
}

export const CATEGORIES = [
  "AI/ML",
  "Blockchain",
  "Web3",
  "Programming",
  "DSA",
  "Engineering Notes",
  "Trading Basics",
  "Tutorials"
];

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "The Future of Generative AI: Beyond Text and Images",
    slug: "future-of-generative-ai",
    description: "Deep dive into how Generative AI is moving into video, 3D modeling, and autonomous agent coordination.",
    metaDescription: "Explore the next frontier of AI. From video generation to autonomous agents and 3D worlds. The future of AI/ML explained.",
    date: "May 10, 2026",
    author: "Sujoy Moulick",
    category: "AI/ML",
    tags: ["AI", "Machine Learning", "Future Tech"],
    readingTime: "8 min read",
    content: `
# The Future of Generative AI: Beyond Text and Images

Generative AI has already transformed how we write and create art. But we are just scratching the surface. The next 24 months will see a shift from "static" generation to "dynamic" and "spatial" generation.

## 1. High-Fidelity Video Generation
Tools like Sora were just the beginning. We are moving towards real-time, high-fidelity video generation that can be used for cinema, gaming, and personalized education.

## 2. 3D World Building
Imagine describing a game level and having the AI generate the entire 3D environment, including physics and textures, in seconds. This will democratize game development.

## 3. Autonomous AI Agents
The shift from LLMs (Large Language Models) to LAMs (Large Action Models). These agents won't just talk; they will perform tasks across different software ecosystems autonomously.

### Conclusion
As developers, our role is shifting from writing every line of code to orchestrating complex AI systems. The future is collaborative.
    `
  },
  {
    title: "Understanding Web3: The Decentralized Internet",
    slug: "understanding-web3-decentralized-internet",
    description: "What exactly is Web3? A comprehensive guide for developers looking to transition from Web2 to the world of decentralization.",
    metaDescription: "Learn the core principles of Web3, blockchain, and decentralized applications. A complete guide for modern developers.",
    date: "May 8, 2026",
    author: "Sujoy Moulick",
    category: "Web3",
    tags: ["Web3", "Blockchain", "Decentralization"],
    readingTime: "6 min read",
    content: `
# Understanding Web3: The Decentralized Internet

Web3 is the next evolution of the internet, characterized by decentralization, blockchain technologies, and token-based economics.

## Core Pillars of Web3
1. **Ownership**: Users own their data and digital assets.
2. **Permissionless**: Anyone can participate without a central authority.
3. **Native Payments**: Using cryptocurrencies for value exchange.

## Why Should Developers Care?
Web3 introduces a new way of building applications. Instead of centralized databases, we use smart contracts. Instead of OAuth, we use wallet-based authentication.

### Key Technologies to Learn
- **Solidity**: For Ethereum smart contracts.
- **Ethers.js / Viem**: For interacting with the blockchain.
- **IPFS**: For decentralized storage.
    `
  },
  {
    title: "Mastering Data Structures: The Key to Technical Interviews",
    slug: "mastering-data-structures-dsa-guide",
    description: "An essential roadmap to mastering DSA for cracking top-tier engineering roles in 2026.",
    metaDescription: "Master DSA for interviews. Learn about Arrays, Linked Lists, Trees, and Graphs. Your ultimate technical interview prep guide.",
    date: "May 5, 2026",
    author: "Sujoy Moulick",
    category: "DSA",
    tags: ["DSA", "Interview Prep", "Algorithms"],
    readingTime: "10 min read",
    content: `
# Mastering Data Structures: The Key to Technical Interviews

Data Structures and Algorithms (DSA) remain the foundation of computer science. Whether you like it or not, they are the primary metric for technical interviews at top-tier companies.

## The Hierarchy of Learning
1. **Linear Data Structures**: Arrays, Strings, Linked Lists.
2. **Non-Linear Data Structures**: Trees, Graphs.
3. **Advanced Algorithms**: Dynamic Programming, Greedy, Backtracking.

## How to Practice Effectively
Don't just memorize solutions. Understand the 'why' behind each data structure. Use platforms like LeetCode or Codeforces, but focus on quality over quantity.

> "A good programmer is someone who can think in abstractions."
    `
  },
  {
    title: "Bitcoin vs Ethereum: The Ultimate Blockchain Comparison",
    slug: "bitcoin-vs-ethereum-blockchain-comparison",
    description: "Comparing the two giants of the crypto world. Understanding digital gold vs the world's computer.",
    metaDescription: "Bitcoin vs Ethereum. Digital Gold vs Smart Contracts. Learn the technical differences between the two largest blockchains.",
    date: "May 1, 2026",
    author: "Sujoy Moulick",
    category: "Blockchain",
    tags: ["Bitcoin", "Ethereum", "Crypto"],
    readingTime: "7 min read",
    content: `
# Bitcoin vs Ethereum: The Ultimate Blockchain Comparison

While both are built on blockchain technology, Bitcoin and Ethereum serve fundamentally different purposes.

## Bitcoin: Digital Gold
Bitcoin was designed as a decentralized alternative to traditional currencies. Its primary value proposition is scarcity and security.

## Ethereum: The World's Computer
Ethereum expanded the blockchain concept by introducing Smart Contracts. It's a platform for building decentralized applications (dApps).

### Comparison Table
| Feature | Bitcoin | Ethereum |
|---------|---------|----------|
| Purpose | Currency | Platform |
| Language | Script | Solidity |
| Consensus | Proof of Work | Proof of Stake |
    `
  },
  {
    title: "Trading Basics for Developers: Why You Should Understand Markets",
    slug: "trading-basics-for-developers",
    description: "An introduction to financial markets, technical analysis, and how developers can build trading tools.",
    metaDescription: "Learn the basics of trading and financial markets. A developer's guide to building trading bots and understanding technical analysis.",
    date: "April 28, 2026",
    author: "Sujoy Moulick",
    category: "Trading Basics",
    tags: ["Finance", "Trading", "Algorithms"],
    readingTime: "9 min read",
    content: `
# Trading Basics for Developers

Financial markets are essentially giant data processing machines. As developers, we are uniquely positioned to understand and navigate these markets using technology.

## Key Concepts
1. **Technical Analysis**: Using historical price data to predict future moves.
2. **Fundamental Analysis**: Evaluating the intrinsic value of an asset.
3. **Algorithmic Trading**: Using code to execute trades based on predefined rules.

## Building Your First Trading Bot
Start with an API like CCXT (for crypto) or Alpaca (for stocks). Focus on risk management before you worry about profit.
    `
  },
  {
    title: "Top 10 Mistakes Beginners Make in Web Development",
    slug: "top-10-mistakes-beginners-make-in-web-development",
    description: "Starting your web development journey is exciting but full of pitfalls. Learn the most common mistakes beginners make.",
    metaDescription: "Avoid common beginner web development mistakes like tutorial hell and ignoring fundamentals.",
    date: "May 3, 2026",
    author: "Sujoy Moulick",
    category: "Programming",
    tags: ["Web Dev", "Beginners", "Learning"],
    readingTime: "5 min read",
    content: `
# Top 10 Mistakes Beginners Make in Web Development

Stepping into the world of web development is like entering a vast, ever-changing ocean. In this guide, we’ll break down the top 10 mistakes that hold beginners back.

## 1. Falling into 'Tutorial Hell'
Tutorial Hell is a state where you can follow a video and build a complex app, but you have no idea how to start a blank project on your own.

## 2. Ignoring the Fundamentals
Many beginners want to jump straight into React. However, frameworks are just abstractions of the basics. Master HTML & CSS first.

## 3. Trying to Learn Everything at Once
Pick a narrow path. Start with the 'Front-End Path' and stick to it until you can build a functional website.
    `
  }
];
