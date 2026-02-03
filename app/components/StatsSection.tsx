import { TrendingUp, Users, Trophy, Star } from 'lucide-react';

export default function StatsSection() {
    const stats = [
        { icon: TrendingUp, value: '500+', label: 'Successful Treks' },
        { icon: Users, value: '2000+', label: 'Happy Travelers' },
        { icon: Trophy, value: '15+', label: 'Years Experience' },
        { icon: Star, value: '4.9', label: 'Average Rating' },
    ];

    return (
        <section className="bg-[#2C5F7D] py-8 relative -mt-10 z-20 mx-4 md:mx-auto max-w-7xl rounded-lg shadow-xl">
            <div className="px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white divide-x-0 md:divide-x divide-white/20">
                    {stats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <div key={index} className="flex flex-col items-center justify-center p-2">
                                <div className="text-3xl md:text-3xl font-bold mb-1">{stat.value}</div>
                                <div className="text-xs md:text-sm text-sky-100 font-medium">{stat.label}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
