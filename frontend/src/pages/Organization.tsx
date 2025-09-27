import Navbar from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface OrgOverviewProps {
    data: Array<Record<string, string>>;
}
function Organiztion({ data }: OrgOverviewProps) {
    return (
        <div className='mx-5'>
            <Navbar />
            <div className="h-11/12 grid grid-cols-[repeat(auto-fill,350px)] m-5 p-5 gap-4 justify-center align-middle dark:bg-muted bg-zinc-200 rounded-sm">
                {data.map((org) => {
                    return (
                        <div
                            key={org.id}
                            className="w-full h-56  rounded-md bg-zinc-300 dark:bg-zinc-800 shadow-2xl flex flex-col justify-around items-center"
                        >
                            <h3 className="text-4xl text-baseline tracking-widest underline decoration-1 underline-offset-8 ">
                                {org.name.substring(0, 10)}..
                            </h3>
                            <p className="w-full text-baseline px-2 truncate">
                                {org.description.substring(0, 50)}
                            </p>
                            <div className="flex items-center justify-around w-full">
                                <Badge
                                    variant="outline"
                                    className="text-md lowercase font-light dark:text-lime-500 light:bg-lime-500"
                                >
                                    Owner
                                </Badge>
                                <Button className="self-end ">
                                    <Link to={`/dashboard/${org?._id}`}>
                                        View
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Organiztion;
