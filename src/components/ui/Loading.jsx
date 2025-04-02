const Loading= () => {
    return (
        <div className="flex items-center justify-center h-64">
            <div>
                <div className="text-gray-500 text-lg">be patient, we are logging you to ziggycom</div>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
            <div className="text-gray-700 mt-4">Loading...</div>
        </div>
    );
}
export default Loading;