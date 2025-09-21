// import { PieChart } from "@/components/ui/PieChart";
// import { formatCurrency } from "@/utils/utilfn";
// import { useQueryClient } from "@tanstack/react-query";

import { PieChart } from '@/components/ui/PieChart';
import { formatCurrency } from '@/utils/utilfn';
import { useQueryClient } from '@tanstack/react-query';
import {  useParams } from 'react-router-dom';

interface OrgOverviewProps {
    data: Array<Record<string, string>>;
}
const empData = {
    labels: ['admin', 'manager', 'staff'],
    datasets: [
        {
            label: 'No. of Employees',
            data: [5, 8, 10],
            backgroundColor: [
                'rgba(247, 54, 96, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1,
        },
    ],
};
const inventoryData = {
    labels: ['inventory1', 'inventory2', 'inventory3'],
    datasets: [
        {
            label: 'Inventory Capacity %',
            data: [5, 8, 90],
            backgroundColor: [
                'rgba(247, 54, 96, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1,
        },
    ],
};

function OrgOverview({ data }: OrgOverviewProps) {
    const { orgId } = useParams();
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData<{ user: User }>(['user']);

    if (orgId) {
        const [orgData] = data.filter((d) => d.id == orgId);
        return (
            <div className="flex flex-col justify-between w-full  h-full jet-brains">
                <div className="flex flex-row justify-between  w-full outline outline-zinc-500 outline-offset-10  mt-3">
                    <h1 className="text-2xl font-light tracking-widest p-2">
                        {orgData.name}
                    </h1>
                    <div className="flex justify-evenly gap-3  w-[50%] font-semibold text-2xl">
                        <div className=" dark:bg-zinc-800 p-2 rounded-sm uppercase bg-red-400 text-white dark:text-green-500 tracking-widest">
                            {formatCurrency(50000)} Imports
                        </div>
                        <div className=" dark:bg-zinc-800 p-2 rounded-sm uppercase bg-green-400 text-white dark:text-red-500 tracking-widest">
                            {formatCurrency(150000)} Exports
                        </div>
                    </div>
                </div>
                <div className="tracking-wide">{orgData.description}</div>
                <span className=" w-fit p-2 text-white rounded-sm bg-blue-500 dark:bg-transparent dark:outline  dark:outline-blue-500">
                    OWNER : {user?.user?.name}
                </span>
                <div className="grid grid-cols-2 w-full">
                    <div className="dark:bg-zinc-800 w-full h-56 mr-2 pt-1  grid place-items-center  rounded-sm overflow-hidden outline outline-[#777] uppercase">
                        Number of Employees
                        <PieChart data={empData} />
                    </div>
                    <div className="dark:bg-zinc-800 w-full h-56 ml-2 pt-1 grid place-items-center rounded-sm overflow-hidden outline outline-[#777] uppercase">
                        Inventory Capacity
                        <PieChart data={inventoryData} />
                    </div>
                </div>
            </div>
        );
    } else return <p>Create your own organiztion</p>;
}

export default OrgOverview;
