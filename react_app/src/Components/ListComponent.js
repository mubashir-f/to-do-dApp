import React, { useState, useEffect } from 'react';
import { Spinner, Card, Button, Form, Row, Col, Container, Modal, Alert } from 'react-bootstrap';
import { FiSquare, FiCheckSquare, FiEdit2, FiTrash, FiPlus, FiX } from "react-icons/fi";

function ListComponent({ toDoContract, account }) {

  //alerts and loaders
  const [showAlert, setShowAlert] = useState(false);
  const [loader, setLoader] = useState({
    loading: true,
    hash: "LOADING"
  });

  //list and list-items
  const [toDoList, setToDoList] = useState(null);
  const [toDoItem, setToDoItem] = useState("");
  const [toEditItem, setToEditItem] = useState({
    id: null,
    task: null,
    isDone: null
  });

  //modals
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);

  // fetch display to-do list
  const getList = async () => {
    const list = await toDoContract.getToDoList();
    setToDoList(list);
  }

  // add item to to-do list
  const addItemToList = async (e) => {
    e.preventDefault();
    const transaction = await toDoContract.addItem(toDoItem);
    setShowAlert(true);
    setLoader({
      loading: true,
      hash: "LOADING"
    })
    await transaction.wait();
    setLoader({
      loading: false,
      hash: transaction.hash
    })
    setToDoItem("");
    getList();
  }

  // update to-do list
  const handleListUpdate = async () => {
    const transaction = await toDoContract.updateItem(toEditItem.id, toEditItem.isDone, toEditItem.task);
    setShow(false);
    setShowAlert(true);
    setLoader({
      loading: true,
      hash: "LOADING"
    })
    await transaction.wait();
    setLoader({
      loading: false,
      hash: transaction.hash
    })
    getList();
  }

  // delete item form to-do list
  const handleListDelete = async () => {
    const transaction = await toDoContract.deleteItem(toEditItem.id);
    setShow1(false);
    setShowAlert(true);
    setLoader({
      loading: true,
      hash: "LOADING"
    })
    await transaction.wait();
    setLoader({
      loading: false,
      hash: transaction.hash
    })
    getList();
  }

  useEffect(() => {
    getList();
  }, []);

  return (
    <Container className='pt-5'>

      {/* dispaly alerts when needed */}
      {showAlert &&
        <Row className="justify-content-center">
          <Col xl="6" xs="10">
            <Alert variant="light">
              <Row>
                <Col md={10} className='text-start'>
                  {loader.hash == "LOADING" ?
                    <Card.Text>
                      <Spinner animation="border" size="sm" role="status">
                        <span className="visually-hidden"></span>
                      </Spinner> {" - "}
                      The transaction is pending. Wait a while.
                    </Card.Text>
                    : <Card.Text>
                      <p>The transaction was successfull. <a href={`https://goerli.etherscan.io/tx/${loader.hash}`} target='_blank'>Check Here</a></p>
                    </Card.Text>
                  }
                </Col>
                <Col md={2} className='text-end'>
                  <Button variant="outline-secondary" disabled={loader.loading} onClick={() => setShowAlert(false)} style={{ marginRight: "10px" }}><FiX /></Button>
                </Col>
              </Row>
            </Alert>
          </Col>
        </Row>
      }

      <Row className="justify-content-center">
        <Col xl="6" xs="10">
          <Card className='mt-2'>
            <Card.Header as="h3">
              NetixSol To-do dApp
            </Card.Header>
            <Card.Body>
              <Row>
                <Col className='text-start'>
                  Connected Wallet:
                </Col>
                <Col className='text-end'>
                  {account.slice(0, 7)}...{account.slice(-7)}
                </Col>
              </Row>
              <Form onSubmit={addItemToList}>
                <Card className='mt-3'>
                  <Card.Body className='py-2'>
                    <Row>
                      <Col md={10} className='text-start'>
                        <input required className='form-control add-task  shadow-none' value={toDoItem} onChange={(e) => { setToDoItem(e.target.value) }} type='text' placeholder="What to do next?" />
                      </Col>
                      <Col md={2} className='text-end'>
                        <Button variant="outline-primary" type='submit' style={{ marginRight: "10px" }}><FiPlus /></Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Form>
              <hr />
              {toDoList ?
                toDoList.map((data, index) => (
                  !data.isDeleted && <Card key={index} className='mt-3 mx-3'>
                    <Card.Body className='py-2'>
                      <Row>
                        <Col md={8} className='text-start'>
                          {data.isDone ? <FiCheckSquare /> : <FiSquare />} {" "} {" - "} {data.toDoItem}
                        </Col>
                        <Col md={4} className='text-end'>
                          <Button variant="outline-success" onClick={() => {
                            setToEditItem({
                              id: data.id,
                              task: data.toDoItem,
                              isDone: data.isDone
                            })
                            setShow(true);
                          }} style={{ marginRight: "10px" }}><FiEdit2 /></Button>
                          <Button variant="outline-danger" onClick={() => {
                            setToEditItem({
                              id: data.id,
                              task: data.toDoItem,
                              isDone: data.isDone
                            })
                            setShow1(true);
                          }}><FiTrash /></Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                )) :
                <Card.Text>
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden"></span>
                  </Spinner>
                </Card.Text>}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* update item modal  */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Control value={toEditItem.task} onChange={(e) => { setToEditItem({ ...toEditItem, task: e.target.value }) }} placeholder="Disabled input" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check type="checkbox" defaultChecked={toEditItem.isDone} onChange={() => { setToEditItem({ ...toEditItem, isDone: !toEditItem.isDone }) }} label="Is task Completed?" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleListUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* delete list modal  */}
      <Modal show={show1} onHide={() => setShow1(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow1(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleListDelete}>
            Yes Delete
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}

export default ListComponent;
