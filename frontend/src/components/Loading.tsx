import React from 'react'
import loadingIcon from '@/assets/images/loading.svg'

const Loading: React.FC = () => {
    return (
        <div className='w-screen h-screen fixed top-0 left-0 z-50 flex justify-center items-center bg-white/80 backdrop-blur-sm'>
            <img src={loadingIcon} width={100} alt="Loading..." />
        </div>
    )
}

export default Loading