const mongoose = require('mongoose');
require('dotenv').config();
const Blog = require('./models/Blog');
const Author = require('./models/Author');

const authorsToSeed = [
  {
    name: 'Sarah Chen',
    role: 'Cloud & DevOps Architect',
    bio: 'Kubernetes advocate and cloud-native systems architect with 8+ years of production experience scaling microservices.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    twitter: 'https://x.com/sarahchen_tech',
    linkedin: 'https://linkedin.com/in/sarahchen',
    github: 'https://github.com/sarahchen',
    website: 'https://sarahchen.cloud'
  },
  {
    name: 'Alex Rivera',
    role: 'AI Research Scientist',
    bio: 'Exploring neural architectures, LLMs, and real-time inference optimization for production enterprise applications.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    twitter: 'https://x.com/alexrivera_ai',
    linkedin: 'https://linkedin.com/in/alexrivera',
    github: 'https://github.com/alexrivera',
    website: 'https://alexrivera.ai'
  },
  {
    name: 'Maya Patel',
    role: 'Cybersecurity Specialist',
    bio: 'Zero-trust evangelist focusing on cloud security postures, penetration testing, and modern application hardening.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    twitter: 'https://x.com/mayapatelsec',
    linkedin: 'https://linkedin.com/in/mayapatel',
    github: 'https://github.com/mayapatel',
    website: 'https://mayapatel.security'
  }
];

const blogsToSeed = [
  {
    title: 'Mastering Kubernetes: From Containers to Production Clusters',
    description: 'A comprehensive guide to orchestrating resilient microservices with Kubernetes in enterprise environments.',
    category: 'Cloud Computing',
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Sarah Chen',
    content: `### Why Kubernetes Dominates Modern Cloud Deployments

Containerization revolutionized how developers package and ship applications. However, managing hundreds or thousands of containers across distributed environments requires automated orchestration. Enter **Kubernetes (K8s)**.

#### Core Architectural Concepts

1. **Pods:** The smallest deployable computing units in Kubernetes.
2. **Deployments & ReplicaSets:** Ensure high availability and automated rollouts/rollbacks.
3. **Services & Ingress:** Manage traffic routing and expose cluster resources safely.
4. **ConfigMaps & Secrets:** Separate configuration from container images.

#### Production Best Practices

- Always define explicit CPU and memory resource requests and limits.
- Implement robust health probes (\`livenessProbe\` and \`readinessProbe\`).
- Adopt automated CI/CD pipelines with GitOps (e.g., ArgoCD or Flux).
- Monitor cluster telemetry using Prometheus and Grafana.

By standardizing deployments through declarative manifests, teams can achieve continuous delivery with near-zero downtime.`
  },
  {
    title: 'The Future of Large Language Models in Everyday Software',
    description: 'How generative AI and foundational models are reshaping software engineering, code generation, and UI experiences.',
    category: 'Artificial Intelligence & Machine Learning',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Alex Rivera',
    content: `### Transforming Human-Computer Interaction with AI

The proliferation of Large Language Models (LLMs) has fundamentally altered expectations for software applications. From static menus to natural language interfaces, user workflows are evolving rapidly.

#### Key Advancements Driving the Shift

- **Retrieval-Augmented Generation (RAG):** Bridging static parametric knowledge with dynamic enterprise databases.
- **Agentic Workflows:** Moving beyond single prompts toward multi-step autonomous planning and tool execution.
- **Low-Latency Edge Inference:** Running quantized models directly on devices for maximum privacy and response speed.

#### Engineering Considerations

When integrating LLMs into web services, developers must account for latency, token costs, hallucination mitigation, and strict evaluation benchmarks. Standardizing structured output formats (JSON Schema) and implementing semantic caching are essential techniques for high-performance applications.`
  },
  {
    title: 'Zero Trust Security: Why Perimeter Defense Is No Longer Enough',
    description: 'Explore the principles of Zero Trust Architecture: never trust, always verify, and assume breach.',
    category: 'Cybersecurity',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Maya Patel',
    content: `### The Paradigm Shift in Network Security

Traditional castle-and-moat security models assumed that everything inside a corporate network was safe. With hybrid work, distributed cloud services, and sophisticated threat vectors, this premise is fatally flawed.

#### The Three Core Pillars of Zero Trust

1. **Explicit Verification:** Always authenticate and authorize based on all available data points (identity, device health, location).
2. **Least Privilege Access:** Limit user access with Just-In-Time (JIT) and Just-Enough-Access (JEA) policies.
3. **Assume Breach:** Minimize blast radius and segment access. Continuously verify end-to-end encryption.

Implementing Zero Trust requires coordinated identity management, continuous telemetry, and automated incident response workflows.`
  },
  {
    title: 'Modern Full-Stack Development with React 19 and Node.js',
    description: 'Discover the latest paradigms in web development, including React Server Components, Actions, and unified data fetching.',
    category: 'Software Development',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
    authorName: 'guru',
    content: `### The Next Generation of Full-Stack Web Apps

React 19 brings powerful capabilities that blur the lines between client and server architectures. Server Actions, direct document metadata management, and streamlined asset loading make building responsive web applications more intuitive than ever.

#### Essential Modern Patterns

- **Server-Side Rendering (SSR) & Streaming:** Delivering interactive HTML to users faster.
- **Optimistic UI Updates:** Providing immediate feedback before network mutations resolve.
- **Type-Safe API Contracts:** Leveraging tools like Zod and TypeScript across both frontend and backend boundaries.

Mastering these paradigms ensures your applications remain snappy, maintainable, and delightful for end users.`
  },
  {
    title: 'Building High-Performance Progressive Web Apps (PWAs)',
    description: 'Combine the best of web and native applications with offline capabilities, background sync, and push notifications.',
    category: 'Web and Mobile App Development',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    authorName: 'guru',
    content: `### The Power of Web Capabilities on Mobile Devices

Progressive Web Apps bridge the gap between traditional browser websites and native mobile apps. With service workers and modern browser APIs, developers can deliver app-like experiences without app store friction.

#### Core PWA Ingredients

- **Web App Manifest:** Provides metadata like icons, display modes, and theme colors.
- **Service Workers:** Intercept network requests, cache critical assets, and enable offline usability.
- **Cache-First vs Network-First:** Implementing tailored caching strategies based on resource freshness requirements.

By optimizing core web vitals and ensuring offline readiness, PWAs drive higher user engagement and retention across all devices.`
  },
  {
    title: 'Serverless Architecture at Scale: Patterns and Pitfalls',
    description: 'An architectural deep-dive into event-driven serverless computing, cold starts, and cost management.',
    category: 'Cloud Computing',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Sarah Chen',
    content: `### Event-Driven Computing in Production

Serverless platforms like AWS Lambda, Google Cloud Functions, and Azure Functions enable developers to focus entirely on application logic without server management overhead.

#### Overcoming Common Serverless Challenges

1. **Cold Starts:** Mitigated by lightweight runtimes and provisioned concurrency.
2. **Database Connection Pooling:** Managed via database proxies or serverless-native data layers.
3. **Observability:** Distributed tracing is essential when requests span asynchronous message queues and serverless handlers.

Serverless excels when architected around stateless workflows, asynchronous queues, and automated scaling policies.`
  },
  {
    title: 'The Rise of Quantum Computing and What It Means for Encryption',
    description: 'Understanding quantum supremacy, Shor algorithm implications, and post-quantum cryptography standards.',
    category: 'Technology & Innovation',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Alex Rivera',
    content: `### Preparing for the Post-Quantum Era

Quantum computers leverage the principles of superposition and entanglement to solve specific mathematical problems exponentially faster than classical supercomputers.

#### The Cryptographic Challenge

Current asymmetric encryption schemes (like RSA and ECC) rely on the difficulty of integer factorization and discrete logarithms. Sufficiently powerful quantum computers running Shor's algorithm could break these ciphers in hours.

#### The Road to Post-Quantum Cryptography (PQC)

Standards organizations like NIST have finalized lattice-based cryptographic algorithms (such as ML-KEM and ML-DSA) designed to withstand quantum cryptanalysis. Organizations must begin auditing cryptographic dependencies and preparing for crypto-agility today.`
  },
  {
    title: 'Clean Code Principles: Writing Maintainable Systems',
    description: 'Timeless principles for crafting readable, extensible, and testable code in collaborative software engineering teams.',
    category: 'Software Development',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Sarah Chen',
    content: `### Code Is Written Once but Read Hundreds of Times

High engineering velocity requires a codebase that is straightforward to understand and safe to modify. Adhering to fundamental clean code principles pays compound dividends over the lifecycle of a software project.

#### Crucial Guidelines

- **Meaningful Names:** Choose descriptive variable, function, and class names that reveal intent.
- **Single Responsibility Principle (SRP):** Functions should do one thing, and do it well.
- **Fail Fast & Explicit Error Handling:** Avoid silent failures; surface errors with clear context.
- **Automated Testing:** Unit and integration tests act as live documentation and guardrails against regressions.`
  },
  {
    title: 'Securing REST and GraphQL APIs in Production',
    description: 'Hardening modern APIs against OWASP API Top 10 vulnerabilities, query depth attacks, and credential stuffing.',
    category: 'Cybersecurity',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Maya Patel',
    content: `### Protecting Critical Data Pipelines

APIs are the backbone of modern web and mobile applications, making them prime targets for malicious actors. Robust API security demands layered defense mechanisms.

#### Top Defense Strategies

- **Strict Schema Validation:** Validate and sanitize every request payload against predefined schemas.
- **Rate Limiting & Throttling:** Prevent brute-force attacks and denial-of-service attempts.
- **GraphQL Query Depth & Cost Analysis:** Guard against deeply nested recursive queries that exhaust server memory.
- **JWT Best Practices:** Use short-lived access tokens, secure HTTP-only cookies, and proper signature verification.`
  },
  {
    title: 'Tech Trends 2026: What Leaders Need to Watch',
    description: 'An executive analysis of autonomous AI agents, spatial computing, green cloud engineering, and edge silicon.',
    category: 'Industry Insights',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Alex Rivera',
    content: `### The Next Wave of Technological Transformation

As technology cycles accelerate, business and engineering leaders must differentiate between transient hype and structural shifts.

#### Key Themes Driving the Industry

1. **Autonomous Multi-Agent Systems:** Software that negotiates, coordinates, and executes complex cross-system tasks independently.
2. **Green Computing & Carbon-Aware Workloads:** Scheduling intensive computational jobs in data centers powered by renewable energy.
3. **Specialized Edge Silicon:** Dedicated neural processing units (NPUs) powering real-time inference on personal hardware.

Embracing adaptable architectures and fostering continuous learning cultures will define the successful organizations of the coming decade.`
  }
];

async function seed() {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/technology_blog';
  const localUri = 'mongodb://127.0.0.1:27017/technology_blog';

  let connected = false;

  // Try primary URI first, fall back to local if needed
  try {
    console.log(`Connecting to primary MongoDB: ${primaryUri.split('@').pop() || primaryUri}`);
    await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 4000 });
    connected = true;
    console.log('Successfully connected to primary MongoDB.');
  } catch (err) {
    console.warn('Primary connection failed:', err.message);
    if (primaryUri !== localUri) {
      console.log(`Falling back to local MongoDB: ${localUri}`);
      try {
        await mongoose.connect(localUri);
        connected = true;
        console.log('Successfully connected to local MongoDB.');
      } catch (localErr) {
        console.error('Local fallback failed:', localErr.message);
      }
    }
  }

  if (!connected) {
    console.error('Could not connect to any MongoDB instance. Aborting.');
    process.exit(1);
  }

  // 1. Seed Authors
  const authorMap = {};
  for (const authorData of authorsToSeed) {
    let author = await Author.findOne({ name: authorData.name });
    if (!author) {
      author = await Author.create(authorData);
      console.log(`Created author: ${author.name}`);
    } else {
      console.log(`Author already exists: ${author.name}`);
    }
    authorMap[author.name] = author._id;
  }

  // Get guru or admin author if available
  const guru = await Author.findOne({ name: 'guru' });
  if (guru) {
    authorMap['guru'] = guru._id;
  }

  // 2. Seed Blogs
  let seededCount = 0;
  for (const blogData of blogsToSeed) {
    const existing = await Blog.findOne({ title: blogData.title });
    if (!existing) {
      const authorId = authorMap[blogData.authorName] || null;
      await Blog.create({
        title: blogData.title,
        description: blogData.description,
        content: blogData.content,
        category: blogData.category,
        image: blogData.image,
        author: blogData.authorName,
        authorId: authorId,
      });
      seededCount++;
      console.log(`Seeded blog: "${blogData.title}"`);
    } else {
      console.log(`Blog already exists: "${blogData.title}"`);
    }
  }

  const total = await Blog.countDocuments();
  console.log(`\nDone! Added ${seededCount} new blogs. Total blogs in database: ${total}`);
  await mongoose.disconnect();
  process.exit(0);
}

seed();
