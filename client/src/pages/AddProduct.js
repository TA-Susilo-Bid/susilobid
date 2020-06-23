import React, { useState, useEffect } from 'react';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { GetCategory, postProduct } from '../redux/action';

// style
import { Button, Form, Grid, Header, Segment, Checkbox } from 'semantic-ui-react';
import Loader from 'react-loader-spinner';

const AddProduct = () => {
  const [imageProduct, setImage] = useState({
    imageName : "",
    imageFile : undefined
  });
  const [formInput, setFormInput] = useState({
    category: '',
    name: '',
    desc: '',
    price: '',
    due_date: '',
    image: ''
  });

  const loading = useSelector(({ auth }) => auth.loading);
  const seller_id = useSelector(({auth}) => auth.user_id);

  const handleChange = e => {
    if (e){
      setFormInput({
            ...formInput,
            [e.target.name] : e.target.value
        });
    }
        
  }

  const handleImage = e => {
    // console.log(e.target.files[0]);
    if(e.target.files[0]){
      setImage({
        imageFile : e.target.files[0],
        imageName : e.target.files[0].name
      });
    } else {
      setImage({
        imageName : "",
        imageFile : undefined
      });
    }
  };

  const handleBtn = () => {
    let { category, name, desc, price, clock, date } = formInput;
      let formData = new FormData();
      formData.append('category',category)
      formData.append('name',name)
      formData.append('desc',desc)
      formData.append('price',price)
      formData.append('due_date',`${date}+ +${clock}`)
      formData.append('imageProduct',imageProduct.imageFile)
      for(var pair of formData.entries()){
        console.log(pair[0], pair[1]);
    }

      setImage({
        imageName : "",
        imageFile : undefined
      })
      dispatch(
        postProduct(formData,seller_id)
      );
  };


  const dispatch = useDispatch();
  
  console.log(imageProduct.imageFile)
  return (
        <Grid textAlign='center' style={{ height: '75vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 550 }}>
                <Header as='h2' color='teal' textAlign='center'>
                    Add Product
                </Header>
                <Form size='large'>
                    <Segment stacked>
                          <Segment>
                            <Form>
                              <Form.Field>
                                <p className="font-weight-bold">Category</p>
                              </Form.Field>
                              <input type="radio" id='Electronic' name='category' value='1' onChange={handleChange}/>
                              <label for="Electronic">Electronic</label><br />
                              <input type="radio" id='Property' name='category' value='2' onChange={handleChange}/>
                              <label for="Property">Property</label><br />
                              <input type="radio" id='Otomotif' name='category' value='3' onChange={handleChange}/>
                              <label for="Otomotif">Otomotif</label><br />
                            </Form>
                          </Segment>
                        
                        <Form.Input fluid icon='name' iconPosition='left' name='name' placeholder='Product Name' onChange={handleChange}/>
                        <Form.Input fluid icon='desc' iconPosition='left' name='desc' placeholder='Product Description' onChange={handleChange}/>
                        <Form.Input fluid icon='price' iconPosition='left' name='price' placeholder='Starting Price' onChange={handleChange}/>
                        <label for="due_date">Due Date</label><br />
                        <Form.Input fluid icon='clock' iconPosition='left' name='clock' placeholder='Due Time (Insert 0-23)' onChange={handleChange}/>
                        <Form.Input type='date' data-date="" data-date-format="YYYY-MM-DD" fluid icon='due_date' iconPosition='left' name='date' onChange={handleChange}/>
                        {/* <Segment>
                            <Form>
                              <Form.Field>
                                <p className="font-weight-bold">Image</p>
                              </Form.Field> */}
                          <label for ="image">Please upload your product image</label><br />
                          <Form.Input type='file' onChange={handleImage} />
                          {/* </Form>
                          </Segment> */}
                        <Button color='teal' fluid size='large' onClick={handleBtn}>
                            {
                                loading
                                ?
                                <Loader type="Circles" color="#009C95" height={20} width={20} />
                                :
                                'Submit'
                            }
                        </Button>
                    </Segment>
                </Form>
            </Grid.Column>
        </Grid>
    );


    // const [formInput, setFormInput] = useState({
    //     category: '',
    //     name: '',
    //     desc: '',
    //     price: '',
    //     due_date: '',
    //     image: ''
    // });

    // const [category, setCategory] = useState([]);

    // // const [length, setLength] = useState(false);
    // // const [number, setNumber] = useState(false);

    // const dispatch = useDispatch();
    // const gCategory = useSelector(state => state.product.category);

    // useEffect(() => {
    //   dispatch(GetCategory());
    // }, [dispatch]);

    // useEffect(() => {
    //   if (gCategory) setCategory(gCategory);
    // }, [gCategory]);

    // const loading = useSelector(({ auth }) => auth.loading);

    // const handleButton = e => setCategory(e);

    // const handleChange = e => {
    //     setFormInput({
    //         ...formInput,
    //         [e.target.name] : e.target.value
    //     });
      
    // };

    // const handleBtn = () => {
    //   let { category, name, desc, price, due_date, image } = formInput;
    //     dispatch(
    //       postProduct({
    //         category, name, desc, price, due_date, image
    //       })
    //     );
    // };
    
    //     const renderCheckbox = () => {
    //       return category.map((val, idx) => {
    //         return (
    //           <Form.Field key={idx}>
    //             <Checkbox
    //               radio
    //               label={val.category}
    //               name="checkboxRadio"
    //               onChange={() => handleButton(val.category)}
    //             />
    //           </Form.Field>
    //         );
    //       });
    //     };

        
      
    // return (
    //     <Grid textAlign='center' style={{ height: '75vh' }} verticalAlign='middle'>
    //         <Grid.Column style={{ maxWidth: 550 }}>
    //             <Header as='h2' color='teal' textAlign='center'>
    //                 Add Product
    //             </Header>
    //             <Form size='large'>
    //                 <Segment stacked>
                        
                        
    //                       <Segment>
    //                         <Form>
    //                           <Form.Field>
    //                             <p className="font-weight-bold">Category</p>
    //                           </Form.Field>
    //                           {renderCheckbox()}
    //                         </Form>
    //                       </Segment>
                        
    //                     <Form.Input fluid icon='name' iconPosition='left' name='name' placeholder='Product Name' onChange={handleChange}/>
    //                     <Form.Input fluid icon='desc' iconPosition='left' name='desc' placeholder='Product Description' onChange={handleChange}/>
    //                     <Form.Input fluid icon='price' iconPosition='left' name='price' placeholder='Starting Price' onChange={handleChange}/>
    //                     <Form.Input fluid icon='due_date' iconPosition='left' name='due_date' placeholder='Due Date' onChange={handleChange}/>
    //                     <Form.Input fluid icon='image' iconPosition='left' name='image' placeholder='Insert Image' onChange={handleChange}/>
    //                     <Button color='teal' fluid size='large' onClick={handleBtn}>
    //                         {
    //                             loading
    //                             ?
    //                             <Loader type="Circles" color="#009C95" height={20} width={20} />
    //                             :
    //                             'Submit'
    //                         }
    //                     </Button>
    //                 </Segment>
    //             </Form>
    //         </Grid.Column>
    //     </Grid>
    // );
}

export default AddProduct;