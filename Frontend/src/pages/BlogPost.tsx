import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft, Tag, Share2, Facebook, Twitter } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import cowHerd from "@/assets/cow-herd.jpg";

const BlogPost = () => {
  const { id } = useParams();

  // In a real app, this would fetch the post based on ID
  const post = {
    id: 1,
    title: "Welcome to GauChara Blog",
    content: `Welcome to WordPress. This is your first post. Edit or delete it, then start writing!

At GauChara, we are excited to share our journey with you through this blog. Here, you'll find updates about our cow welfare initiatives, success stories from our gaushalas, educational content about Bos Indicus cow care, and ways you can get involved in our sacred mission.

## Our Mission

GauChara is a sacred initiative of the Savadia Foundation, dedicated to the nourishment and welfare of Bos Indicus cows across India. Through comprehensive programs including nutritious silage distribution, veterinary care, and gaushala support, we work tirelessly to ensure that every sacred cow receives the care she deserves.

## What to Expect

In the coming weeks and months, we'll be sharing:

- **Impact Stories**: Real accounts of how your donations are making a difference
- **Educational Content**: Learn about cow nutrition, health, and sustainable farming
- **Event Updates**: Stay informed about our activities and how you can participate
- **Volunteer Spotlights**: Meet the dedicated individuals who make our work possible

## Join Us

We invite you to be part of this sacred journey. Whether through donations, volunteering, or simply spreading awareness, every contribution matters. Together, we can ensure that Gaumata receives the love, care, and nourishment she deserves.

Thank you for your support.

🙏 Jai Gaumata!`,
    image: cowHerd,
    author: "GauChara Team",
    date: "January 8, 2026",
    category: "Announcements",
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                {post.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-medium text-foreground">{post.author}</div>
                  <div className="text-sm text-muted-foreground">Author</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl overflow-hidden"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-[400px] md:h-[500px] object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-3"
            >
              <div className="prose prose-lg max-w-none">
                {post.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="font-display text-2xl font-bold text-foreground mt-8 mb-4">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n').map(item => item.replace('- ', ''));
                    return (
                      <ul key={index} className="list-disc pl-6 space-y-2 text-muted-foreground">
                        {items.map((item, i) => (
                          <li key={i}>{item.replace(/\*\*/g, '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Share */}
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-foreground flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Share this post:
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Facebook className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Twitter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="card-sacred p-6 sticky top-24">
                <h3 className="font-display text-lg font-bold text-foreground mb-4">
                  Support Our Mission
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Your donation helps us provide care for thousands of sacred cows across India.
                </p>
                <Link to="/donate">
                  <Button variant="sacred" className="w-full">
                    Donate Now
                  </Button>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPost;
