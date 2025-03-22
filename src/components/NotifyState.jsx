import React from "react";
import {Link} from "react-router-dom";

function CurrentState(){
    return(
        <>
            <div>
                <h2 className="w-full text-center text-gray-600 text-2xl my-10 font-bold font-manrope leading-normal">
                    Help us identify your company on the platform. <Link to="/login">already have an account? </Link>
                </h2>                
            </div>
        </>
    )
}
export default CurrentState;