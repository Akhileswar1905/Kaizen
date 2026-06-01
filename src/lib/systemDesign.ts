export interface SystemTopic {
  title: string
  slug: string
  readTime: string
}

export interface SystemModule {
  id: number
  title: string
  totalChapters: number
  description: string
  accentColor: string
  topics: SystemTopic[]
}

export const systemDesignSyllabus: SystemModule[] = [
  {
    id: 1,
    title: "Introduction & Core Trade-Offs",
    totalChapters: 17,
    accentColor: "border-emerald-500",
    description:
      "Review the baseline laws governing system reliability, computing constraints, latency penalties, and vertical vs horizontal system provisioning.",
    topics: [
      {
        title: "System design topics: start here",
        slug: "system-design-topics-start-here",
        readTime: "5 mins",
      },
      {
        title: "Step 1: Review the scalability video lecture",
        slug: "step-1-review-the-scalability-video-lecture",
        readTime: "45 mins",
      },
      {
        title: "Step 2: Review the scalability article",
        slug: "step-2-review-the-scalability-article",
        readTime: "20 mins",
      },
      { title: "Next steps", slug: "next-steps", readTime: "5 mins" },
      {
        title: "Performance vs scalability",
        slug: "performance-vs-scalability",
        readTime: "15 mins",
      },
      {
        title: "Latency vs throughput",
        slug: "latency-vs-throughput",
        readTime: "15 mins",
      },
      {
        title: "Availability vs consistency",
        slug: "availability-vs-consistency",
        readTime: "10 mins",
      },
      { title: "CAP theorem", slug: "cap-theorem", readTime: "15 mins" },
      {
        title: "CP - consistency and partition tolerance",
        slug: "cp---consistency-and-partition-tolerance",
        readTime: "10 mins",
      },
      {
        title: "AP - availability and partition tolerance",
        slug: "ap---availability-and-partition-tolerance",
        readTime: "10 mins",
      },
      {
        title: "Consistency patterns",
        slug: "consistency-patterns",
        readTime: "10 mins",
      },
      {
        title: "Weak consistency",
        slug: "weak-consistency",
        readTime: "5 mins",
      },
      {
        title: "Eventual consistency",
        slug: "eventual-consistency",
        readTime: "10 mins",
      },
      {
        title: "Strong consistency",
        slug: "strong-consistency",
        readTime: "10 mins",
      },
      {
        title: "Availability patterns",
        slug: "availability-patterns",
        readTime: "10 mins",
      },
      { title: "Fail-over", slug: "fail-over", readTime: "15 mins" },
      { title: "Replication", slug: "replication", readTime: "15 mins" },
      {
        title: "Availability in numbers",
        slug: "availability-in-numbers",
        readTime: "10 mins",
      },
    ],
  },
  {
    id: 2,
    title: "Edge Layer Infrastructure",
    totalChapters: 12,
    accentColor: "border-blue-500",
    description:
      "Orchestrate ingress request flows using hierarchical DNS management, localized content networks, reverse proxies, and distribution policies.",
    topics: [
      {
        title: "Domain name system",
        slug: "domain-name-system",
        readTime: "20 mins",
      },
      {
        title: "Content delivery network",
        slug: "content-delivery-network",
        readTime: "15 mins",
      },
      { title: "Push CDNs", slug: "push-cdns", readTime: "10 mins" },
      { title: "Pull CDNs", slug: "pull-cdns", readTime: "10 mins" },
      { title: "Load balancer", slug: "load-balancer", readTime: "20 mins" },
      { title: "Active-passive", slug: "active-passive", readTime: "10 mins" },
      { title: "Active-active", slug: "active-active", readTime: "10 mins" },
      {
        title: "Layer 4 load balancing",
        slug: "layer-4-load-balancing",
        readTime: "15 mins",
      },
      {
        title: "Layer 7 load balancing",
        slug: "layer-7-load-balancing",
        readTime: "15 mins",
      },
      {
        title: "Horizontal scaling",
        slug: "horizontal-scaling",
        readTime: "10 mins",
      },
      {
        title: "Reverse proxy (web server)",
        slug: "reverse-proxy-web-server",
        readTime: "20 mins",
      },
      {
        title: "Load balancer vs reverse proxy",
        slug: "load-balancer-vs-reverse-proxy",
        readTime: "15 mins",
      },
    ],
  },
  {
    id: 3,
    title: "Application & Database Layers",
    totalChapters: 16,
    accentColor: "border-yellow-500",
    description:
      "Compare relational data engines against NoSQL document, wide-column, graph, and key-value pools. Master scaling patterns.",
    topics: [
      {
        title: "Application layer",
        slug: "application-layer",
        readTime: "10 mins",
      },
      { title: "Microservices", slug: "microservices", readTime: "25 mins" },
      {
        title: "Service discovery",
        slug: "service-discovery",
        readTime: "15 mins",
      },
      { title: "Database", slug: "database", readTime: "10 mins" },
      {
        title: "Relational database management system (RDBMS)",
        slug: "relational-database-management-system-rdbms",
        readTime: "20 mins",
      },
      {
        title: "Master-slave replication",
        slug: "master-slave-replication",
        readTime: "15 mins",
      },
      {
        title: "Master-master replication",
        slug: "master-master-replication",
        readTime: "15 mins",
      },
      { title: "Federation", slug: "federation", readTime: "15 mins" },
      { title: "Sharding", slug: "sharding", readTime: "20 mins" },
      {
        title: "Denormalization",
        slug: "denormalization",
        readTime: "15 mins",
      },
      { title: "SQL tuning", slug: "sql-tuning", readTime: "20 mins" },
      { title: "NoSQL", slug: "nosql", readTime: "15 mins" },
      {
        title: "Key-value store",
        slug: "key-value-store",
        readTime: "10 mins",
      },
      { title: "Document store", slug: "document-store", readTime: "10 mins" },
      {
        title: "Wide column store",
        slug: "wide-column-store",
        readTime: "10 mins",
      },
      { title: "Graph Database", slug: "graph-database", readTime: "15 mins" },
      { title: "SQL or NoSQL", slug: "sql-or-nosql", readTime: "20 mins" },
    ],
  },
  {
    id: 4,
    title: "Advanced Caching Paradigms",
    totalChapters: 12,
    accentColor: "border-pink-500",
    description:
      "Prevent application and database layer exhaustion. Design memory-tier lookup architectures utilizing optimized clean-up policies.",
    topics: [
      { title: "Cache", slug: "cache", readTime: "10 mins" },
      { title: "Client caching", slug: "client-caching", readTime: "5 mins" },
      { title: "CDN caching", slug: "cdn-caching", readTime: "5 mins" },
      {
        title: "Web server caching",
        slug: "web-server-caching",
        readTime: "10 mins",
      },
      {
        title: "Database caching",
        slug: "database-caching",
        readTime: "15 mins",
      },
      {
        title: "Application caching",
        slug: "application-caching",
        readTime: "15 mins",
      },
      {
        title: "Caching at the database query level",
        slug: "caching-at-the-database-query-level",
        readTime: "15 mins",
      },
      {
        title: "Caching at the object level",
        slug: "caching-at-the-object-level",
        readTime: "15 mins",
      },
      {
        title: "When to update the cache",
        slug: "when-to-update-the-cache",
        readTime: "10 mins",
      },
      { title: "Cache-aside", slug: "cache-aside", readTime: "15 mins" },
      { title: "Write-through", slug: "write-through", readTime: "10 mins" },
      {
        title: "Write-behind (write-back)",
        slug: "write-behind-write-back",
        readTime: "15 mins",
      },
      { title: "Refresh-ahead", slug: "refresh-ahead", readTime: "10 mins" },
    ],
  },
  {
    id: 5,
    title: "Asynchronism & Communication Contracts",
    totalChapters: 9,
    accentColor: "border-orange-500",
    description:
      "Decouple blockages from synchronous processing paths. Implement message and task-worker patterns along with serialization parameters.",
    topics: [
      { title: "Asynchronism", slug: "asynchronism", readTime: "10 mins" },
      { title: "Message queues", slug: "message-queues", readTime: "20 mins" },
      { title: "Task queues", slug: "task-queues", readTime: "15 mins" },
      { title: "Back pressure", slug: "back-pressure", readTime: "15 mins" },
      { title: "Communication", slug: "communication", readTime: "10 mins" },
      {
        title: "Transmission control protocol (TCP)",
        slug: "transmission-control-protocol-tcp",
        readTime: "25 mins",
      },
      {
        title: "User datagram protocol (UDP)",
        slug: "user-datagram-protocol-udp",
        readTime: "20 mins",
      },
      {
        title: "Remote procedure call (RPC)",
        slug: "remote-procedure-call-rpc",
        readTime: "20 mins",
      },
      {
        title: "Representational state transfer (REST)",
        slug: "representational-state-transfer-rest",
        readTime: "25 mins",
      },
    ],
  },
  {
    id: 6,
    title: "Security & Appendix Benchmarks",
    totalChapters: 8,
    accentColor: "border-purple-500",
    description:
      "Evaluate production architectures, map memory reference thresholds to structural designs, and review interview case studies.",
    topics: [
      { title: "Security", slug: "security", readTime: "30 mins" },
      { title: "Appendix", slug: "appendix", readTime: "5 mins" },
      {
        title: "Powers of two table",
        slug: "powers-of-two-table",
        readTime: "10 mins",
      },
      {
        title: "Latency numbers every programmer should know",
        slug: "latency-numbers-every-programmer-should-know",
        readTime: "15 mins",
      },
      {
        title: "Additional system design interview questions",
        slug: "additional-system-design-interview-questions",
        readTime: "45 mins",
      },
      {
        title: "Real world architectures",
        slug: "real-world-architectures",
        readTime: "60 mins",
      },
      {
        title: "Company architectures",
        slug: "company-architectures",
        readTime: "60 mins",
      },
      {
        title: "Company engineering blogs",
        slug: "company-engineering-blogs",
        readTime: "30 mins",
      },
    ],
  },
]
