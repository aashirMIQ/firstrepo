import React from 'react'

import {
    Menu,
    Container,
    Dropdown,
    Header,
    Grid,
    Sidebar,
    Icon
} from 'semantic-ui-react'
import { formatNum } from '../../oscar-pos-core/constants'


const Box = ({ data, title, currency, percent, roundOff }) => {


    return (
        <Grid.Column verticalAlign='middle'>
            <div style={styles.boxMain} >
                <Grid.Row style={styles.heading}>
                    <Header as='h5' style={styles.headingText}>{title}</Header>
                </Grid.Row>
                <Grid.Row style={styles.textValue}>
                    {currency}{" "}{roundOff ? formatNum(data.toFixed(2)) : data}{percent ? ' %' : ''}
                </Grid.Row>
            </div>
        </Grid.Column>
    )
}


const styles = {

    boxMain: {
        minHeight: 170,
        marginBottom: 30,
        marginTop: 15,
        paddingBottom: 20,
        paddingTop: 35,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        textAlign: 'center',
        boxShadow: '0 1px 6px rgba(0, 0, 0, 0.1)',
    },
    comparision: {
        // fontFamily: 'Roboto',
        color: '#666874',
        fontWeight: 300,
        fontSize: 10,
        marginTop: 5,
    },
    heading: {
        flex: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 5,
    },
    headingOne: {
        fontSize: 14,
        // fontFamily: 'Roboto',
        color: '#666874',
        fontWeight: 300,
        marginTop: 17,
    },
    headingText: {
        fontSize: 16,
        // fontFamily: 'Roboto',
        color: '#666874',
        fontWeight: 300,
        marginBottom: 8,
    },
    icon: {
        height: 8,
        width: 10,
        justifyContent: 'center',
        paddingTop: 0
    },
    textValue: {
        fontSize: 32,
        fontWeight: 400,
        flex: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        // fontFamily: 'Roboto',
        color: '#313131',
    }

}

export default Box;
