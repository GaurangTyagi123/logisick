import { Skeleton } from "@/components/ui/skeleton"

export function LazyLoad() {
    return (
        <>
            <Skeleton className="h-30 mb-2" />
            <div className="flex justify-end space-x-2 w-full h-20">
                <Skeleton className="w-30 h-10"/>
                <Skeleton className="w-30 h-10"/>
                <Skeleton className="w-10 h-10"/>
            </div>
            <table className="h-screen flex flex-col justify-evenly">
                <thead className="flex h-20 justify-center space-x-2">
                    <th className="w-full h-10"><Skeleton className="h-full"/></th>
                    <th className="w-full h-10"><Skeleton className="h-full"/></th>
                    <th className="w-full h-10"><Skeleton className="h-full"/></th>
                </thead>
                <tbody className="flex flex-col h-full w-[90%] justify-start space-x-2">
                    <tr className="h-70 flex flex-col  space-y-2">
                        <Skeleton className="h-30" />
                        <Skeleton className="h-30" />
                        <Skeleton className="h-30" />
                        <Skeleton className="h-30" />
                    </tr>
                </tbody>
            </table>
        </>
    )
}
