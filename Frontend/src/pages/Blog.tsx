import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import cowHerd from "@/assets/cow-herd.jpg";
import cowFeeding from "@/assets/cow-feeding.jpg";
import silageFeed from "@/assets/silage-feed.jpg";

const blogPosts = [
  {
    id: 1,
    title: "Welcome to GauChara Blog",
    excerpt: "Welcome to our blog! This is your first post. We'll be sharing updates about our cow welfare initiatives, success stories, and ways you can help support Gaumata.",
    image: cowHerd,
    author: "GauChara Team",
    date: "January 8, 2026",
    category: "Announcements",
  },
  {
    id: 2,
    title: "The Importance of Quality Silage for Cow Welfare",
    excerpt: "Learn about how high-quality silage contributes to the health and well-being of Bos Indicus cows, and why nutrition is at the heart of our mission.",
    image: silageFeed,
    author: "Dr. Priya Sharma",
    date: "January 5, 2026",
    category: "Education",
  },
  {
    id: 3,
    title: "A Day in the Life at Our Gaushala",
    excerpt: "Follow along as we take you through a typical day at one of our partner gaushalas, from morning feeding to evening care routines.",
    image: cowFeeding,
    author: "Volunteer Team",
    date: "January 1, 2026",
    category: "Stories",
  },
  {
    id: 4,
    title: "How Your Donations Make a Difference",
    excerpt: "See the direct impact of your generous contributions through our quarterly impact report highlighting the lives touched by your support.",
    image: cowHerd,
    author: "GauChara Team",
    date: "December 28, 2025",
    category: "Impact",
  },
];

import PageHero from "@/components/layout/PageHero";

const Blog = () => {
  return (
    <Layout>
      <PageHero
        title="Stories &"
        accentText="Updates"
        subtitle="Our Blog"
        description="Stay connected with our mission through stories, updates, and insights about cow welfare and our sacred work."
      />

      {/* Blog Posts */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {/* Featured Post */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center bg-card rounded-2xl overflow-hidden border border-border shadow-lg">
              <div className="relative h-64 lg:h-full min-h-[300px]">
                <img
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-accent text-accent-foreground text-sm font-medium rounded-full">
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {blogPosts[0].category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {blogPosts[0].date}
                  </span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {blogPosts[0].title}
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-medium text-foreground">{blogPosts[0].author}</span>
                  </div>
                  <Link to={`/blog/${blogPosts[0].id}`}>
                    <Button variant="sacred">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Post Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-sacred overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-secondary/90 text-secondary-foreground text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground">{post.author}</span>
                    </div>
                    <Link
                      to={`/blog/${post.id}`}
                      className="text-primary font-medium text-sm hover:text-primary/80 flex items-center gap-1"
                    >
                      Read
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline-sacred" size="lg">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
