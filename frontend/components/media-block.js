import React from 'react'
import Async from 'react-code-splitting'

export default ({ callAgain }) => (
    <Async
        componentProps={{
            callAgain: callAgain,
        }}
        load={import(/* webpackChunkName: 'media' */ 'Components/media')}
    />
)
