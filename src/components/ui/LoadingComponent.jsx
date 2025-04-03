const LoadingState= () => {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="text-center">
                <div className="block mx-auto animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                <div className="text-gray-700 mt-4">Loading...</div>
            </div>
        </div>
    );
}
export default LoadingState;