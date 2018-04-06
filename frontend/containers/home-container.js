import React, { Component } from 'react'
import MediaBlock from '../Components/media-block'

class Home extends Component {
    constructor() {
        super()

        console.log('Home init')
    }

    render() {
        return (
            <div>
                <h1>Home</h1>
                <MediaBlock callAgain={true} />
            </div>
        )
    }
}

export default Home
