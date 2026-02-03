import { TrendingUp, Users, Trophy, Star } from 'lucide-react';

export default function StatsSection() {
    const stats = [
        { icon: TrendingUp, value: '500+', label: 'Successful Treks' },
        { icon: Users, value: '2000+', label: 'Happy Travelers' },
        { icon: Trophy, value: '15+', label: 'Years Experience' },
        { icon: Star, value: '4.9', label: 'Average Rating' },
    ];

    return (
        <section className="bg-gradient-to-r from-cyan-400 to-cyan-500 py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
                    {stats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <div key={index} className="flex flex-col items-center">
                                <IconComponent className="w-12 h-12 mb-3" strokeWidth={1.5} />
                                <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                                <div className="text-sm md:text-base opacity-90">{stat.label}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
