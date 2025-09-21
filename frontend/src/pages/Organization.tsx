import Navbar from '@/components/Navbar';
import Button from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface OrgOverviewProps {
    data: Array<Record<string, string>>;
}
function Organiztion({ data }: OrgOverviewProps) {
    return (
        <>
            <Navbar />
            <div className="h-11/12 grid grid-cols-[repeat(auto-fill,350px)] m-5 p-5 gap-4 justify-center align-middle bg-muted rounded-sm">
                {data.map((org) => {
                    return (
                        <div
                            key={org.id}
                            className="w-full h-56 rounded-md bg-zinc-300 dark:bg-zinc-800 shadow-2xl flex flex-col justify-around items-center"
                        >
                            <h3 className="text-4xl text-baseline tracking-widest underline decoration-1 underline-offset-8 ">
                                {org.name.substring(0, 10)}..
                            </h3>
                            <p>{org.catchPhrase}</p>
                            <Button className="self-end mr-5">
                                <Link to={`/dashboard/${org.id}`}>View</Link>
                            </Button>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default Organiztion;
