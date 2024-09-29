import React from 'react';
import DaumPostcodeEmbed from "react-daum-postcode";

function AddressModal() {
    return (
        <div className="absolute left-1/2">
            <div>
                <DaumPostcodeEmbed/>
            </div>
        </div>
    )
}

export default AddressModal;