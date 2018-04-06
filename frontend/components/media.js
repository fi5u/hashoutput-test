import React from 'react'
import Async from 'react-code-splitting'

export default ({ callAgain }) => (
    <div>
        Media Element
        {callAgain && (
            <Async
                load={import(/* webpackChunkName: 'media-block' */ 'Components/media-block')}
            />
        )}
    </div>
)
