import React, { useState } from 'react';
import { Redirect } from 'react-router-dom'

// redux
import { useDispatch, useSelector } from 'react-redux';
import { Register } from '../redux/action';

// style
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react';
import Loader from 'react-loader-spinner';

const RegisterPage = () => {

    const [formInput, setFormInput] = useState({
        username: '',
        email: '',
        password: '',
        confirmPass: '',
        address: '',
        phone: ''
    });
    const [length, setLength] = useState(false);
    const [number, setNumber] = useState(false);

    const dispatch = useDispatch();

    const role = useSelector(({ auth }) => auth.role_id);
    const loading = useSelector(({ auth }) => auth.loading);
    const username = useSelector(({ auth }) => auth.username);

    const handleChange = e => {
        setFormInput({
            ...formInput,
            [e.target.name] : e.target.value
        });
        let pass = e.target.value;
        let validateNum = /[0-9]/;
        // console.log(valNumber.test(pass))
        setNumber(validateNum.test(pass));
        setLength(pass.length > 7);
    };

    const handleBtn = () => {
        let { username, email, password, confirmPass, address, phone } = formInput;
        if (username && email && password && confirmPass) {
            if (password === confirmPass) {
                dispatch(
                    Register({
                        username,
                        email,
                        password,
                        address,
                        phone
                    })
                );
            } else {
                window.alert('invalid password');
            }
        } else {
            alert('please fill in all the forms');
        }
    };

    if (username) {
        return (
            <Redirect to='/'/>
        );
    };
    if (role === 1) {
        return <Redirect to='/internal' />
    }
    return (
        <Grid textAlign='center' style={{ height: '75vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 550 }}>
                <Header as='h2' color='teal' textAlign='center'>
                    Register Now . It's Free
                </Header>
                <Form size='large'>
                    <Segment stacked>
                        <Form.Input fluid icon='user' iconPosition='left' name='username' placeholder='Username' onChange={handleChange}/>
                        <Form.Input fluid icon='mail' iconPosition='left' name='email' placeholder='Email' onChange={handleChange}/>
                        <Form.Input fluid icon='home' iconPosition='left' name='address' placeholder='Address' onChange={handleChange}/>
                        <Form.Input fluid icon='phone' iconPosition='left' name='phone' placeholder='Phone Number' onChange={handleChange}/>
                        {
                            length && number
                            ?
                            <Form.Input fluid icon='lock' iconPosition='left' name='password' placeholder='Password' type='password' onChange={handleChange} />
                            :
                            <Form.Input fluid icon='lock' iconPosition='left' name='password' placeholder='Password' type='password'  onChange={handleChange} 
                                error={{
                                    content: 'Password must contain at least 8 characters & including number and letterword ',
                                    pointing: 'below',
                                }}
                            />
                        }
                        <Form.Input fluid icon='checkmark' iconPosition='left' name='confirmPass' placeholder='Confirm Password' type='password' onChange={handleChange}/>
                        <Button color='teal' fluid size='large' onClick={handleBtn}>
                            {
                                loading
                                ?
                                <Loader type="Circles" color="#009C95" height={20} width={20} />
                                :
                                'Register'
                            }
                        </Button>
                    </Segment>
                </Form>
            </Grid.Column>
        </Grid>
    );
}

export default RegisterPage;