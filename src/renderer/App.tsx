import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import './css/sidebars.css';
import './css/main.css';
import React, { FormEvent } from 'react';
import {
  Container,
  Col,
  ListGroup,
  Row,
  Button,
  Card,
  Spinner,
} from 'react-bootstrap';
import log from 'loglevel';
import { CheckCircle } from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ModelsView from './ModelsView';
import PromptsView from './PromptsView';
import ErrorBoundary from './ErrorBoundary';

type State = {
  showPromptsView: boolean;
  showModelsView: boolean;
  showQuery: boolean;
  showResponse: boolean;
  showContext: boolean;
  modelName: string;
  promptName: string;
  contextText: string;
  responseText: string;
  validated: boolean;
  running: boolean;
  queryText: string;
  showModelError: boolean;
  showPromptError: boolean;
};
class Main extends React.Component<{}, State> {
  constructor(state: State) {
    super(state);
    this.state = {
      showPromptsView: false,
      showModelsView: false,
      showQuery: true,
      showResponse: true,
      showContext: true,
      modelName: '',
      promptName: '',
      validated: false,
      responseText: '',
      running: false,
      queryText: '',
      showModelError: false,
      showPromptError: false,
      contextText: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.showPromptsView = this.showPromptsView.bind(this);
    this.showModelsView = this.showModelsView.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      const newState = {
        [event.target.name as string]: event.target.value as any,
      } as State;
      this.setState(newState);
      event.preventDefault();
    } catch (error) {
      log.error(`ERROR ${error}`);
    }
  }

  killProcess = () => {
    window.electron.pyRenderer.removeAllListeners();
    this.setState({
      running: false,
    });
  };

  resetQuery = () => {
    this.setState({
      queryText: '',
    });
  };

  resetResponse = () => {
    this.setState({
      responseText: '',
    });
  };

  resetContext = () => {
    this.setState({
      contextText: '',
    });
  };

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.setState({
      running: true,
    });
    const tgt = event.currentTarget;
    const { modelName, promptName } = this.state;
    if (!(tgt.checkValidity() && modelName.length && promptName.length)) {
      event.stopPropagation();
      this.setState({
        validated: true,
        running: false,
        showModelError: !modelName.length,
        showPromptError: !promptName.length,
      });
      return;
    }
    const data = new FormData(event.target as HTMLFormElement);
    const contextText = data.get('contextText');
    const queryText = data.get('queryText');
    const args = [modelName, queryText, promptName, contextText];

    try {
      const temp = await window.electron.pyRenderer.queryLocalLLMContext(args);
      this.setState({
        // eslint-disable-next-line no-control-regex
        responseText: temp.join('\r\n').replace(/[^\x00-\x7F]/g, ''),
        running: false,
        showModelError: false,
        showPromptError: false,
      });
    } catch (error) {
      log.error(`ERROR ${error}`);
      this.setState({
        running: false,
      });
    }
  };

  closePromptsView = (row: any) => {
    const modelName = JSON.parse(row.target.id);
    // @ts-ignore
    // eslint-disable-next-line
    const modelContext = JSON.parse(modelName.row.run_order).find((element) => element === '$context' );
    const show = typeof modelContext !== 'undefined';
    try {
      this.setState({
        showPromptsView: false,
        showModelsView: false,
        showResponse: true,
        showQuery: true,
        showContext: show,
        promptName: modelName.row.prompt_name,
        showPromptError: false,
      });
    } catch (error) {
      log.error(`ERROR ${error}`);
    }
  };

  showPromptsView = async () => {
    try {
      this.setState({
        showPromptsView: true,
        showModelsView: false,
        showResponse: false,
        showQuery: false,
        showContext: false,
      });
    } catch (error) {
      log.error(`ERROR ${error}`);
    }
  };

  showModelsView = async () => {
    try {
      this.setState({
        showModelsView: true,
        showPromptsView: false,
        showQuery: false,
        showResponse: false,
        showContext: false,
      });
    } catch (error) {
      log.error(`ERROR ${error}`);
    }
  };

  closeModelsView = async (row: any) => {
    const mName = JSON.parse(row.target.id);
    try {
      this.setState({
        showModelsView: false,
        showPromptsView: false,
        showResponse: true,
        showQuery: true,
        showContext: true,
        modelName: mName.row.model_name,
        showModelError: false,
      });
    } catch (error) {
      log.error(`ERROR ${error}`);
    }
  };

  render() {
    const {
      showPromptsView,
      showModelsView,
      showQuery,
      showResponse,
      showContext,
      modelName,
      promptName,
      validated,
      responseText,
      running,
      queryText,
      contextText,
      showModelError,
      showPromptError,
    } = this.state;
    return (
      <Container fluid>
        <Form
          noValidate
          name="main"
          onSubmit={this.handleSubmit}
          validated={validated}
        >
          <Col className="col-lg-12 p-3">
            <Row>
              <Col className="col-lg-2">
                <div className="flex-column flex-shrink-3 p-3 text-dark bg-light border rounded border-secondary shadow-lg">
                  <div className="fw-bolder fs-2 mx-auto mb-3 border rounded border-secondary shadow-sm text-center">
                    <i className="ms-1 me-1 bi bi-collection-fill" />
                    ai-base
                  </div>
                  <ListGroup>
                    <ListGroup.Item>
                      {modelName.length ? (
                        <>
                          <Button
                            onClick={this.showModelsView}
                            variant="outline-dark w-100 text-start align-middle"
                          >
                            <span
                              style={{ fontSize: 13 }}
                              className="align-middle pe-2"
                            >
                              1. Choose a Model
                            </span>
                            <CheckCircle className="bi align-middle" />
                          </Button>
                          <h6>
                            {!showModelError ? (
                              <span className="badge bg-secondary">
                                {modelName}
                              </span>
                            ) : (
                              <span className="badge text-danger">
                                Please choose a Model.
                              </span>
                            )}
                          </h6>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={this.showModelsView}
                            variant="outline-dark w-100 text-start"
                          >
                            <span style={{ fontSize: 13 }}>
                              1. Choose a Model
                            </span>
                          </Button>
                          <h6>
                            {!showModelError ? (
                              <span className="badge bg-secondary">
                                {modelName}
                              </span>
                            ) : (
                              <span className="badge text-danger">
                                Please choose a Model.
                              </span>
                            )}
                          </h6>
                        </>
                      )}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      {promptName.length ? (
                        <>
                          <Button
                            variant="outline-dark w-100 text-start align-middle"
                            onClick={this.showPromptsView}
                          >
                            <span
                              style={{ fontSize: 13 }}
                              className="align-middle pe-3"
                            >
                              1. Choose a Prompt
                            </span>
                            <CheckCircle className="bi align-middle" />
                          </Button>
                          <h6>
                            {!showPromptError ? (
                              <span className="badge bg-secondary">
                                {promptName}
                              </span>
                            ) : (
                              <span className="badge text-danger">
                                Please choose a Prompt.
                              </span>
                            )}
                          </h6>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline-dark w-100 text-start"
                            onClick={this.showPromptsView}
                          >
                            <span style={{ fontSize: 13 }}>
                              2. Choose a Prompt
                            </span>
                          </Button>
                          <h6>
                            {!showPromptError ? (
                              <span className="badge bg-secondary">
                                {promptName}
                              </span>
                            ) : (
                              <span className="badge text-danger">
                                Please choose a Prompt.
                              </span>
                            )}
                          </h6>
                        </>
                      )}
                    </ListGroup.Item>
                  </ListGroup>
                </div>
              </Col>
              <Col className="col-lg-10 h-100">
                {showModelsView ? (
                  <Row className="mb-0 row-cols-1 justify-content-center h-50">
                    <ErrorBoundary>
                      {' '}
                      <ModelsView parentCallback={this.closeModelsView} />{' '}
                    </ErrorBoundary>
                  </Row>
                ) : null}
                {showPromptsView ? (
                  <Row className="mb-0 row-cols-1 justify-content-center h-50">
                    <ErrorBoundary>
                      {' '}
                      <PromptsView
                        parentCallback={this.closePromptsView}
                      />{' '}
                    </ErrorBoundary>
                  </Row>
                ) : null}
                {showResponse ? (
                  <Row className="mb-0 row-cols-1 justify-content-center">
                    <Card className="bg-light border rounded border-secondary shadow-lg">
                      <Card.Body>
                        <span className="badge bg-light text-dark">
                          {' '}
                          Response
                        </span>
                        <Form.Control
                          isInvalid={false}
                          readOnly
                          as="textarea"
                          name="responseText"
                          id="responseText"
                          rows={15}
                          className="form-control"
                          placeholder=""
                          aria-label=""
                          aria-describedby="button-addon2"
                          value={responseText}
                          onChange={this.handleChange}
                        />
                        <div className="pt-2">
                          <Button
                            onClick={this.resetResponse}
                            type="button"
                            variant="outline-dark float-end"
                          >
                            Clear Text
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Row>
                ) : null}
                {showContext ? (
                  <Row className="row-cols-1 justify-content-center p-r-5">
                    <Card className="bg-light border rounded border-secondary shadow-lg">
                      <Card.Body>
                        <span className="badge bg-light text-dark">
                          Context
                        </span>
                        <InputGroup hasValidation>
                          <Form.Control
                            isInvalid={validated}
                            required
                            as="textarea"
                            rows={5}
                            name="contextText"
                            id="contextText"
                            className="form-control"
                            value={contextText}
                            maxLength={2048}
                            minLength={1}
                            placeholder=""
                            aria-label=""
                            aria-describedby="button-addon2"
                            onChange={this.handleChange}
                          />
                        </InputGroup>
                        <div className="pt-2">
                          <Button
                            onClick={this.resetContext}
                            type="button"
                            variant="outline-dark float-end"
                          >
                            Clear Text
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Row>
                ) : null}
                {showQuery ? (
                  <Row className="row-cols-1 justify-content-center p-r-5">
                    <Card className="bg-light border rounded border-secondary shadow-lg">
                      <Card.Body>
                        <span className="badge bg-light text-dark">Query</span>
                        <InputGroup hasValidation>
                          <Form.Control
                            required
                            as="textarea"
                            isInvalid={validated}
                            rows={5}
                            id="queryText"
                            value={queryText}
                            name="queryText"
                            className="form-control"
                            maxLength={240}
                            minLength={1}
                            aria-label=""
                            onChange={this.handleChange}
                            aria-describedby="button-addon2"
                          />
                          {!running ? (
                            <Button
                              type="submit"
                              variant="outline-dark"
                              id="submit"
                            >
                              Run Query
                            </Button>
                          ) : (
                            <Button variant="outline-dark">
                              <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                              Loading...
                            </Button>
                          )}
                        </InputGroup>
                        <div className="pt-2">
                          <Button
                            onClick={this.resetQuery}
                            type="button"
                            variant="outline-dark float-end"
                          >
                            Clear Text
                          </Button>
                          <Button
                            onClick={this.killProcess}
                            type="button"
                            variant="outline-dark float-end"
                          >
                            Cancel
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Row>
                ) : null}
              </Col>
            </Row>
          </Col>
        </Form>
      </Container>
    );
  }
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}
