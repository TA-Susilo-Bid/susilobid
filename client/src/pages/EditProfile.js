import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Input, FormGroup, Form, Label } from 'reactstrap';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, editProfile, checkStatus, Logout } from '../redux/action';

const EditProfile = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProfile());
    }, [dispatch]);

    const logged = useSelector(({ auth }) => auth.logged);
    const role = useSelector(({ auth }) => auth.role_id);
    const id = useSelector((state) => state.auth.user_id);
    const status = useSelector(({ status }) => status.status);
    const loading = useSelector((state) => state.profile.loading);

    useEffect(() => {
        dispatch(checkStatus(id));
    }, [id]);

    useEffect(() => {
        if (status === 'Banned') dispatch(Logout());
    }, [status]);

    const [formInput, setFormInput] = useState({
        address: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = e => {
        setFormInput({
            ...formInput,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        if (formInput.password === formInput.confirmPassword) {
            dispatch(editProfile(id, formInput));
        }
    };

    if (role === 1) {
        return <Redirect to='/internal' />
    }
    if (!logged) {
        return <Redirect to='/' />
    }
    return (
        <React.Fragment>
            <h1 style={styles.header}>
                Edit Your Profile
            </h1>
            <p style={styles.warning}>All forms must be filled</p>
            <div style={styles.formDiv}>
                <Form style={styles.form}>
                    <FormGroup>
                        <Label>Address</Label>
                        <Input type="text" name="address" placeholder="Address" onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Phone</Label>
                        <Input type="text" name="phone" placeholder="Phone" onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Password</Label>
                        <Input type="password" name="password" placeholder="Password" onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Confirm Password</Label>
                        <Input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />
                    </FormGroup>
                    <div style={styles.buttonDiv}>
                        <Button variant="outline-dark" style={styles.button} type="submit" onClick={handleSubmit}>
                            {
                                loading
                                ?
                                'Loading...'
                                :
                                'Submit Edit'
                            }
                        </Button>
                    </div>
                </Form>
            </div>
        </React.Fragment>
    );
};

const styles = {
    header: {
        textAlign: 'center',
        marginTop: '60px',
    },
    warning: {
        textAlign: 'center',
        color: 'red',
        fontWeight: 'lighter',
        fontSize: '15px',
    },
    formDiv: {
        display: 'flex',
        justifyContent: 'center',
        height: '60vh',
        alignItems: 'center',
    },
    form: {
        width : '400px',
        height: '400px',
    },
    buttonDiv: {
        display: 'flex',
        justifyContent: 'space-around',
    },
    button: {
        fontSize: '15px',
        borderRadius: '10px',
        margin: '10px',
        padding: '10px',
    },
};

export default EditProfile;