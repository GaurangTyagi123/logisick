import OrganizationModal from '@/components/modals/OrganizationModal';
import Navbar from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { Suspense, useState } from 'react';
import { Link } from 'react-router-dom';

interface OrgOverviewProps {
    data: Array<Record<string, string>>;
}
function Organiztion({ data }: OrgOverviewProps) {
    const [openOrgForm, setOpenOrgForm] = useState(false);
    return (
        <>
            <div className="mx-5 flex flex-col justify-center">
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
                                        className="text-md lowercase font-light dark:text-lime-500"
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
                <Button
                    size="lg"
                    className="rounded-full self-end fixed bottom-6 right-20 h-[50px] w-[50px]"
                    onClick={() => setOpenOrgForm(!openOrgForm)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                    >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </Button>
                <Suspense>
                    <OrganizationModal
                        open={openOrgForm}
                        setOpen={setOpenOrgForm}
                    />
                </Suspense>
            </div>
        </>
    );
}

export default Organiztion;
