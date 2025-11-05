import { Skeleton } from "@/components/ui/skeleton"

export function LazyLoad() {
    return (
        <>
           <Skeleton className="h-30 mb-2" />
            <div className="flex justify-end space-x-2 w-full h-20">
                <Skeleton className="w-30 h-10" />
                <Skeleton className="w-30 h-10" />
                <Skeleton className="w-10 h-10" />
            </div>
            <div className="h-screen w-[90%] flex flex-col justify-evenly">
                <div className="flex h-20 justify-center space-x-2">
                    <div className="w-full h-10"><Skeleton className="h-full" /></div>
                    <div className="w-full h-10"><Skeleton className="h-full" /></div>
                    <div className="w-full h-10"><Skeleton className="h-full" /></div>
                </div>
                <div className="flex flex-col h-full w-[90%] justify-start space-x-2">
                    <div className="h-70 flex flex-col  space-y-2">
                        <Skeleton className="h-30" />
                        <Skeleton className="h-30" />
                        <Skeleton className="h-30" />
                        <Skeleton className="h-30" />
                    </div>
                </div>
            </div>
        </>
    )
}
