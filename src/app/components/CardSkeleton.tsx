export function CardSkeleton() {
    return (
        <div className="w-full h-full bg-zinc-800 rounded-xl shadow-xl animate-pulse">
            <div className="flex flex-col justify-between h-full p-6">
                <div>
                    <div className="w-20 h-6 bg-zinc-700 rounded mb-2"></div>
                    <div className="flex">
                        <div className="mr-4 w-24 h-24 bg-zinc-700 rounded-full"></div>
                        <div className="flex flex-col flex-grow">
                            <div className="w-3/4 h-6 bg-zinc-700 rounded mb-2"></div>
                            <div className="w-1/2 h-4 bg-zinc-700 rounded mb-2"></div>
                            <div className="w-full h-4 bg-zinc-700 rounded"></div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 w-full">
                    <div className="w-full h-10 bg-zinc-700 rounded"></div>
                </div>
            </div>
        </div>
    );
}
