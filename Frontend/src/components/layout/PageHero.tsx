import { motion } from "framer-motion";

interface PageHeroProps {
    title: string;
    subtitle?: string;
    description?: string;
    accentText?: string;
}

const PageHero = ({ title, subtitle, description, accentText }: PageHeroProps) => {
    return (
        <section className="relative h-[45vh] bg-secondary overflow-hidden flex items-center pt-20">
            <div className="absolute inset-0 bg-sacred-pattern opacity-10" />
            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    {subtitle && (
                        <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-medium mb-3 backdrop-blur-sm">
                            {subtitle}
                        </span>
                    )}
                    <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-3">
                        {title} {accentText && <span className="text-white/90">{accentText}</span>}
                    </h1>
                    {description && (
                        <p className="text-base md:text-lg text-white/90 max-w-3xl mx-auto font-serif line-clamp-2">
                            {description}
                        </p>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default PageHero;
