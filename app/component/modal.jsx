import React from "react";


export default function Modal({isOpen,onClose,children}){
    if (!isOpen) return null;

    return(
        <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
        >
          <div
           className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
           onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
    )
}